import { expect, Locator } from "@playwright/test";

export async function expectMenuButtonToBeSelected(menuButton: Locator): Promise<void> {
    const classAttr = await menuButton.getAttribute('class');
    expect(classAttr).toBe('selected');
}

export async function expectMenuButtonToNotBeSelected(menuButton: Locator): Promise<void> {
    const classAttr = await menuButton.getAttribute('class');
    expect(classAttr).toBe('');
}