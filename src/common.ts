export const hexToBytes = (hex: string) => {
  return Buffer.from(hex.replace('0x', ''), 'hex')
}
