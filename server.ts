import { parse, Earthstar, ReplicaServer as RS } from './deps.ts';

const {
  ExtensionKnownShares,
  ExtensionSyncWebsocket,
  ReplicaServer
} = RS;
const { ReplicaDriverSqlite } = Earthstar;

const flags = parse(Deno.args, {
  string: ['port', 'hostname'],
  default: {
    port: 8080,
    hostname: '0.0.0.0'
  }
});

const server = createServer({
  hostname: flags.hostname,
  port: flags.port
});

console.log(`Started showcase server on ${flags.hostname}:${flags.port}`);

function createServer (opts?) {
  return new ReplicaServer([
    new ExtensionKnownShares({
      knownSharesPath: './known_shares.json',
      onCreateReplica: (shareAddress) => {
        return new Earthstar.Replica(
          shareAddress,
          Earthstar.FormatValidatorEs4,
          new ReplicaDriverSqlite({
            share: shareAddress,
            filename: `./data/${shareAddress}.sql`,
            mode: 'create-or-open'
          }),
        );
      },
    }),
    new ExtensionSyncWebsocket({
      path: '/earthstar-api/v2'
    }),
  ], opts);
}
