import { assert } from 'chai';
import { childProcessReader, childProcessWriter } from '../..';

const { equal, ok, deepEqual } = assert;

import * as cp from 'child_process';
import * as os from 'os';
import * as fsp from 'path';

describe(module.id, () => {
    it('echo ok', async () => {
        if (os.type() === 'Windows_NT') {
            ok('Ignore on Windows');
        } else {
            const proc = cp.spawn('echo', ['hello\nworld']);
            const got = await childProcessReader(proc).toArray();
            deepEqual(got, ['hello', 'world']);
        }
    });

    it('bad command', async () => {
        const proc = cp.spawn(fsp.join(__dirname, 'foobar.zoo'), ['2']);
        try {
            const got = await childProcessReader(proc).toArray();
            ok(false);
        } catch (ex) {
            ok(ex.code < 0); // -1 on node 0.10 but -2 on 0.12
        }
    });

    it('exit 2', async () => {
        const cmd = 'exit2' + (os.type() === 'Windows_NT' ? '.cmd' : '.sh');
        const proc = cp.spawn(fsp.join(__dirname, '../../../test/fixtures', cmd), ['2']);
        try {
            const got = await childProcessReader(proc).toArray();
            ok(false);
        } catch (ex) {
            equal(ex.code, 2);
        }
    });
});
