/**
 * chatbot.service.ts - Lógica de procesamiento de mensajes para D' Y&C ORGANIC
 */

export class ChatbotService {
  public static async processMessage(userMessage: string): Promise<string> {
    const lower = userMessage.toLowerCase().trim();

    if (lower.includes('envio') || lower.includes('envío') || lower.includes('entrega') || lower.includes('costo')) {
      return "🚚 Realizamos envíos a todo el país (República Dominicana). Los detalles y costos exactos del envío los coordinamos directamente contigo al finalizar tu pedido por WhatsApp.";
    }

    if (lower.includes('ingrediente') || lower.includes('quimico') || lower.includes('químico') || lower.includes('sulfato') || lower.includes('parabeno')) {
      return "🌱 Todos nuestros productos son 100% orgánicos, libres de sulfatos, sal, parabenos y químicos agresivos, diseñados para cuidar la salud de tu hebra capilar y piel.";
    }

    if (lower.includes('jabon') || lower.includes('jabón') || lower.includes('piel') || lower.includes('cara')) {
      return "🧼 Contamos con jabones artesanales de Avena & Miel y de Coco & Karité, ideales para hidratar y exfoliar pieles delicadas o sensibles.";
    }

    if (lower.includes('diagnostico') || lower.includes('diagnóstico') || lower.includes('recomendacion') || lower.includes('ia')) {
      return "✨ Puedes ir a la pestaña 'Diagnóstico IA' en el menú principal para recibir una rutina capilar recomendada por nuestra IA según tu tipo de cabello.";
    }

    if (lower.includes('horario') || lower.includes('donde') || lower.includes('dónde') || lower.includes('ubicacion')) {
      return "📍 Operamos desde República Dominicana. Puedes realizar tus pedidos por nuestra web las 24 horas y te atendemos vía WhatsApp para coordinar la entrega.";
    }

    return "Gracias por tu mensaje 🌿. Si deseas realizar un pedido o necesitas atención personalizada inmediata, puedes presionar el botón de WhatsApp en tu carrito de compras.";
  }
}
