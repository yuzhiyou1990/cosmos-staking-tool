export default class MathWalletExtension {

    static getOfflineSigner() {
        return window.offlineSigner;
    }
    static async getAccount() {
        let offlineSigner = MathWalletExtension.getOfflineSigner()
        if (!offlineSigner) {
            throw new Error("Please install MathWallet first!")
        }
        let accounts = await offlineSigner.getAccounts();
        if (!accounts || accounts.length == 0) {
            throw new Error("No Accounts!");
        }
        return {
            account: accounts[0], 
            offlineSigner
        };
    }
}