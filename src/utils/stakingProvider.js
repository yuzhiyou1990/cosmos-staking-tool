
import { setupStakingExtension, QueryClient, SigningStargateClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
export default class StakingProvider {
    constructor(rpcUrl = "https://rpc.cosmos.network") {
        this.rpcUrl = rpcUrl;
    }

    async stakingDatas(delegatorAddress) {
        let queryClient = QueryClient.withExtensions(await Tendermint34Client.connect(this.rpcUrl));
        let stakingExtension = setupStakingExtension(queryClient);
        let delegationResponses = (await stakingExtension.staking.delegatorDelegations(delegatorAddress)).delegationResponses;
        let validators = (await stakingExtension.staking.delegatorValidators(delegatorAddress)).validators;

        if (delegationResponses && validators) {
            return delegationResponses.map(d => {
                let validator = validators.find(v1 => v1.operatorAddress == d.delegation.validatorAddress);
                return {
                    balance: d.balance,
                    delegatorAddress,
                    validatorAddress: validator.operatorAddress,
                    description: validator.description
                }
            })
        }
        return [];
    }

    async undelegate(delegatorAddress, validatorAddress, balance, offlineSigner) {
        const client = await SigningStargateClient.connectWithSigner(this.rpcUrl, offlineSigner);

        const amount = {
            denom: "uatom",
            amount: balance
        };

        const fee = {
            amount: [{
                denom: "uatom",
                amount: "5000",
            }],
            gas: "250000"
        }
        return await client.undelegateTokens(delegatorAddress, validatorAddress, amount, fee);
    }

    async delegate(delegatorAddress, validatorAddress, balance, offlineSigner) {
        const client = await SigningStargateClient.connectWithSigner(this.rpcUrl, offlineSigner);

        const amount = {
            denom: "uatom",
            amount: balance
        };

        const fee = {
            amount: [{
                denom: "uatom",
                amount: "5000",
            }],
            gas: "250000"
        }
        return await client.delegateTokens(delegatorAddress, validatorAddress, amount, fee);
    }
}