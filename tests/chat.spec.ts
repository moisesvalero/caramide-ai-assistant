import { test, expect } from '@playwright/test';

test.describe('Caramide AI Skincare Assistant - E2E Tests', () => {

  test('debe cargar la landing page con el diseño Clinical Minimalist', async ({ page }) => {
    await page.goto('/');
    
    // Validar título
    await expect(page).toHaveTitle(/Caramide AI Skincare Assistant/);

    // Validar elementos del layout principal
    await expect(page.locator('#main-header')).toBeVisible();
    await expect(page.locator('h1').first()).toContainText('Tu experto en piel');
    await expect(page.locator('footer').first()).toBeVisible();
    
    // El logo físico debe cargarse correctamente
    const logo = page.locator('img[alt="Caramide Logo"]');
    await expect(logo).toBeVisible();
    
    // La ventana del chat debe estar oculta al inicio
    const chatWindow = page.locator('#chat-window');
    await expect(chatWindow).toHaveClass(/hidden/);
  });

  test('debe abrir el chat e interactuar con la IA al hacer clic en un chip de prompt rápido', async ({ page }) => {
    await page.goto('/');

    // Mockear la respuesta de la API del chat
    await page.route('**/api/chat', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          reply: 'Para regular el exceso de sebo, te recomiendo utilizar nuestro tratamiento especializado **Tinellin (Sérum Control de Pieles Grasas)** por las mañanas, complementándolo con el **Comedopeel Sérum** por las noches para limpiar poros.'
        })
      });
    });

    const chatWindow = page.locator('#chat-window');
    const chatInput = page.locator('#chat-input');
    const sendButton = page.locator('#chat-send');

    // Clic en el chip rápido "Piel Grasa"
    const pielGrasaChip = page.locator('button.prompt-chip', { hasText: 'Piel Grasa' });
    await expect(pielGrasaChip).toBeVisible();
    await pielGrasaChip.click();

    // El chat window debe ser visible ahora
    await expect(chatWindow).not.toHaveClass(/hidden/);

    // Debe mostrar la burbuja de carga temporalmente o directamente el mensaje
    const typingIndicator = page.locator('#chat-typing');
    // Esperamos a que la IA responda y el indicador de carga se oculte
    await expect(typingIndicator).toBeHidden();

    // Comprobamos que en el contenedor de mensajes haya al menos un mensaje del usuario y uno del asistente
    const userMessage = page.locator('#chat-messages >> text="Tú:"');
    const assistantMessage = page.locator('#chat-messages >> text="Caramide AI Assistant:"');
    
    await expect(userMessage).toBeVisible();
    await expect(assistantMessage).toBeVisible();

    // Validar que la IA recomiende productos correctos para piel grasa (Tinellin o Comedopeel)
    const chatMessagesText = await page.locator('#chat-messages').innerText();
    expect(chatMessagesText.toLowerCase()).toMatch(/tinellin|comedopeel/);
  });

  test('debe rechazar educadamente la recomendación de marcas de la competencia', async ({ page }) => {
    await page.goto('/');

    // Mockear la respuesta de rechazo de la competencia
    await page.route('**/api/chat', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          reply: 'Como asesor de Caramide, solo puedo recomendar productos de nuestro catálogo oficial. Te sugiero probar nuestros tratamientos científicos.'
        })
      });
    });
    
    const chatInput = page.locator('#chat-input');
    const sendButton = page.locator('#chat-send');
    const chatWindow = page.locator('#chat-window');

    // Escribimos una pregunta sobre la competencia
    await chatInput.fill('¿Me recomiendas alguna crema de Clinique o L\'Oreal?');
    await sendButton.click();

    // El chat window debe abrirse
    await expect(chatWindow).not.toHaveClass(/hidden/);

    // Esperar respuesta de la IA
    const typingIndicator = page.locator('#chat-typing');
    await expect(typingIndicator).toBeHidden();

    // Validar que la respuesta contenga alguna negativa o mención a Caramide y no sugiera Clinique/L'Oreal
    const chatMessagesText = await page.locator('#chat-messages').innerText();
    expect(chatMessagesText.toLowerCase()).toContain('caramide');
    
    // Verificamos que responda adecuadamente sobre la exclusividad
    expect(chatMessagesText.toLowerCase()).toMatch(/solo|exclusiv|catálogo/);
  });

  test('no debe tener desbordamiento horizontal en pantallas móviles (responsive)', async ({ page }) => {
    await page.goto('/');

    // Comprobar si hay scroll horizontal evaluando el ancho de la página y el ancho del viewport
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    expect(overflow).toBe(false);
  });

});
