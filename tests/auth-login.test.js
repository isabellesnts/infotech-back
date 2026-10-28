import test from 'node:test';
import assert from 'node:assert/strict';
import { Auth } from '../src/middlewares/Auth.js';
test('login aceita credenciais padrão do sistema quando a tabela de usuários não existe', async () => {
    const usuario = await Auth.getUserByCredentials('admin@admin.com', 'admin123');
    assert.ok(usuario);
    assert.equal(usuario.email, 'admin@admin.com');
    assert.equal(usuario.role, 'admin');
});
//# sourceMappingURL=auth-login.test.js.map