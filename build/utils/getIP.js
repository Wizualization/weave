"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
function getIP() {
    const ifaces = os_1.default.networkInterfaces();
    const addresses = [];
    // https://stackoverflow.com/a/8440736/1820638
    Object.keys(ifaces).forEach(function (ifname) {
        let alias = 0;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                addresses.push({ ifname, alias, address: iface.address });
            }
            else {
                // this interface has only one ipv4 adress
                addresses.push({ ifname, alias, address: iface.address });
            }
            ++alias;
        });
    });
    return addresses[0].address;
}
exports.default = getIP;
