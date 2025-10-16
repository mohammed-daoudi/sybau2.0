import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/lib/types';

interface OrderStatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  date?: Date;
}

interface OrderTrackingProps {
  orderId: string;
  currentStatus: OrderStatus;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  carrier?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    description?: string;
  }[];
}

export function OrderTracking({
  orderId,
  currentStatus,
  estimatedDelivery,
  trackingNumber,
  carrier,
  statusHistory,
}: OrderTrackingProps) {
  const steps: OrderStatusStep[] = [
    {
      status: 'processing',
      label: 'Order Processing',
      description: 'Your order has been received and is being processed',
    },
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      description: 'Payment confirmed and order verified',
    },
    {
      status: 'preparing',
      label: 'Preparing',
      description: 'Your order is being prepared for shipping',
    },
    {
      status: 'shipped',
      label: 'Shipped',
      description: 'Your order is on its way',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      description: 'Package delivered successfully',
    },
  ];

  // Map timestamps to steps
  const stepsWithDates = steps.map(step => {
    const historyEntry = statusHistory.find(h => h.status === step.status);
    return {
      ...step,
      date: historyEntry?.timestamp,
    };
  });

  const getStepStatus = (stepStatus: OrderStatus) => {
    const statusIndex = steps.findIndex(s => s.status === currentStatus);
    const stepIndex = steps.findIndex(s => s.status === stepStatus);
    
    if (stepIndex < statusIndex) return 'complete';
    if (stepIndex === statusIndex) return 'current';
    return 'upcoming';
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">Order #{orderId}</h2>
          {estimatedDelivery && (
            <p className="text-sm text-gray-600">
              Estimated Delivery: {estimatedDelivery.toLocaleDateString()}
            </p>
          )}
        </div>
        <Badge variant={currentStatus === 'delivered' ? 'secondary' : 'default'}>
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </Badge>
      </div>

      {trackingNumber && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium">Tracking Information</p>
          <p className="text-sm text-gray-600">
            {carrier}: {trackingNumber}
          </p>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200" />
        
        <div className="space-y-8 relative">
          {stepsWithDates.map((step, index) => (
            <div key={step.status} className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 
                  ${
                    getStepStatus(step.status) === 'complete'
                      ? 'bg-green-500 text-white'
                      : getStepStatus(step.status) === 'current'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {getStepStatus(step.status) === 'complete' ? '✓' : index + 1}
              </div>
              
              <div className="flex-1">
                <p className="font-medium">{step.label}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
                {step.date && (
                  <p className="text-xs text-gray-500">
                    {step.date.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}