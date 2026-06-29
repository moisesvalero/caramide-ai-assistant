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
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          reply:
            'Para piel grasa te sugiero **CeraVe Gel Limpiador Espumoso** (CeraVe) por la mañana y **The Ordinary Glycolic Acid 7% Toning Solution** (The Ordinary) por la noche. - [Ver en Amazon](https://www.amazon.es/s?k=CeraVe+Gel+Limpiador) | [Ver en Google](https://www.google.com/search?tbm=shop&q=CeraVe+Gel+Limpiador)',
        }),
      });
    });

    const chatWindow = page.locator('#chat-window');

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

    // Validar que la IA recomiende marcas externas (CeraVe o The Ordinary)
    const chatMessagesText = await page.locator('#chat-messages').innerText();
    expect(chatMessagesText.toLowerCase()).toMatch(
      /cerave|the ordinary|la roche|vichy|bioderma|eucerin|neutrogena|av[eè]ne/,
    );
  });

  test('debe recomendar productos de marcas externas con enlaces a Amazon y Google', async ({ page }) => {
    await page.goto('/');

    // Mockear la respuesta recomendando productos de otras marcas
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          reply:
            'Te recomiendo **CeraVe Hidratante Facial con SPF** (CeraVe) por la mañana. [Ver en Amazon](https://www.amazon.es/s?k=CeraVe+Hidratante+SPF) | [Ver en Google](https://www.google.com/search?tbm=shop&q=CeraVe+Hidratante+SPF)',
        }),
      });
    });

    const chatInput = page.locator('#chat-input');
    const sendButton = page.locator('#chat-send');
    const chatWindow = page.locator('#chat-window');

    await chatInput.fill('¿Me recomiendas una crema hidratante de CeraVe?');
    await sendButton.click();

    await expect(chatWindow).not.toHaveClass(/hidden/);

    const typingIndicator = page.locator('#chat-typing');
    await expect(typingIndicator).toBeHidden();

    const chatMessagesText = await page.locator('#chat-messages').innerText();
    // La IA debe mencionar marcas externas
    expect(chatMessagesText.toLowerCase()).toMatch(
      /cerave|the ordinary|la roche|vichy|bioderma|eucerin|neutrogena|av[eè]ne/,
    );
    // Debe incluir los enlaces externos
    expect(chatMessagesText.toLowerCase()).toMatch(/amazon\.es|google\.com\/search/);
    // No debe recomendar productos Caramide/Laramide
    expect(chatMessagesText.toLowerCase()).not.toMatch(
      /retibak|oxystem|mistify|tinellin|comedopeel|pureglycopeel|vitaminic|maxinadin|dna repair/,
    );
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
