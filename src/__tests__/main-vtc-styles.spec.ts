import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('main VTC styles', () => {
    it('should import VTC micro-front styles in main.ts', () => {
        const mainSource = readFileSync(resolve(__dirname, '../main.ts'), 'utf-8');

        expect(mainSource).toContain('@softour/maas-vtc-micro-front-private/style.css');
    });
});
