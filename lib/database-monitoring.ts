import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { format } from 'date-fns';
import { MongoClient } from 'mongodb';

const execAsync = promisify(exec);

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'sybau';
const BACKUP_RETENTION_DAYS = 7;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export async function createBackup(): Promise<string> {
  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

  try {
    // Create backup using mongodump
    await execAsync(`mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`);
    console.log(`Backup created successfully at ${backupPath}`);

    // Clean up old backups
    await cleanOldBackups();

    return backupPath;
  } catch (error) {
    console.error('Backup creation failed:', error);
    throw error;
  }
}

async function cleanOldBackups(): Promise<void> {
  const files = await fs.promises.readdir(BACKUP_DIR);
  const now = new Date();

  for (const file of files) {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = await fs.promises.stat(filePath);
    const daysOld = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

    if (daysOld > BACKUP_RETENTION_DAYS) {
      await fs.promises.rm(filePath, { recursive: true });
      console.log(`Deleted old backup: ${filePath}`);
    }
  }
}

// Database monitoring functions
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  details: {
    connectionTime: number;
    operationsCheck: boolean;
    replicationStatus?: any;
  };
}> {
  const client = new MongoClient(MONGODB_URI);

  try {
    const startTime = Date.now();
    await client.connect();
    const connectionTime = Date.now() - startTime;

    // Check basic operations
    const db = client.db(DB_NAME);
    await db.command({ ping: 1 });

    // Check replication status if using replica set
    let replicationStatus;
    try {
      replicationStatus = await db.admin().replSetGetStatus();
    } catch (e) {
      // Not a replica set, ignore
    }

    return {
      status: 'healthy',
      details: {
        connectionTime,
        operationsCheck: true,
        replicationStatus,
      },
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      details: {
        connectionTime: -1,
        operationsCheck: false,
      },
    };
  } finally {
    await client.close();
  }
}

// Database metrics collection
export async function collectDatabaseMetrics(): Promise<{
  collections: number;
  documents: number;
  indexes: number;
  storageSize: number;
  avgQueryTime: number;
}> {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const stats = await db.stats();
    const collections = await db.collections();
    let totalDocuments = 0;
    let totalIndexes = 0;

    // Collect metrics from each collection
    for (const collection of collections) {
      const collStats = await collection.stats();
      totalDocuments += collStats.count;
      totalIndexes += collStats.nindexes;
    }

    // Sample query time
    const startTime = Date.now();
    await db.collection('products').find({}).limit(1).toArray();
    const queryTime = Date.now() - startTime;

    return {
      collections: collections.length,
      documents: totalDocuments,
      indexes: totalIndexes,
      storageSize: stats.storageSize,
      avgQueryTime: queryTime,
    };
  } finally {
    await client.close();
  }
}

// Automated monitoring task
export function startMonitoring(interval = 5 * 60 * 1000): void {
  setInterval(async () => {
    try {
      const [health, metrics] = await Promise.all([
        checkDatabaseHealth(),
        collectDatabaseMetrics(),
      ]);

      console.log('Database Health:', health);
      console.log('Database Metrics:', metrics);

      // Here you would typically send these metrics to your monitoring system
      // (e.g., Datadog, New Relic, custom monitoring dashboard, etc.)
      
      if (health.status === 'unhealthy') {
        // Send alerts through your preferred notification system
        console.error('Database is unhealthy!');
      }
    } catch (error) {
      console.error('Monitoring task failed:', error);
    }
  }, interval);
}