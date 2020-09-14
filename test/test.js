import test from 'ava';
import {esbuildServerSideJs} from '../index.mjs';

test('foo', t => {
	esbuildServerSideJs({
		projectDir: 'test/',
		shims: ['test/src/main/resources/lib/nashorn/global.es']
	});
    t.pass();
});
