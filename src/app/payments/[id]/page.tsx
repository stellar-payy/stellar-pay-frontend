import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { ApiRequestError, getPayment, getPaymentWebhookEvents } from "@/lib/api";
import type { ListWebhookEventsResponse, Payment } from "@/lib/types";
import { PaymentDetailPanel } from "@/components/PaymentDetailPanel";
import { WebhookEventsTable } from "@/components/WebhookEventsTable";

interface PaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailPage({ params }: PaymentDetailPageProps): Promise<ReactElement> {
  const { id } = await params;

  let payment: Payment;
  let webhookEvents: ListWebhookEventsResponse;
  try {
    [payment, webhookEvents] = await Promise.all([getPayment(id), getPaymentWebhookEvents(id)]);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="flex flex-col gap-8 px-6 py-8">
      <PaymentDetailPanel payment={payment} />
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Webhook delivery attempts</h2>
        <WebhookEventsTable events={webhookEvents.data} />
      </div>
    </div>
  );
}
