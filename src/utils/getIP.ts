import os from 'os';

interface Address {
  ifname: string;
  alias: number;
  address: string;
}

function getIP(): string {
  const ifaces = os.networkInterfaces();
  const addresses: Address[] = [];

  // https://stackoverflow.com/a/8440736/1820638
  Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ifaces[ifname]!.forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        addresses.push({ ifname, alias, address: iface.address });
      } else {
        // this interface has only one ipv4 adress
        addresses.push({ ifname, alias, address: iface.address });
      }
      ++alias;
    });
  });

  return addresses[0].address;
}

export default getIP;
