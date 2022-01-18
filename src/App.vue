<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h2>Cosmos Staking Tool</h2>
      <v-spacer />
      <v-btn v-if="!account" @click="loginAction">登录</v-btn>
      <div v-else>{{ account ? account.address : ""}}</div>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" v-for="(validator, i) in validators" :key="i">
            <v-card>
              <v-card-title>
                {{ validator.description.moniker }}
              </v-card-title>
              <v-card-subtitle>
                {{ validator.balance.amount }} {{ validator.balance.denom }}
              </v-card-subtitle>
              <v-card-actions>
                <v-btn @click="undelegateAction(validator)" class="error">undelegate</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-btn @click="delegateAction()" class="primary" v-if="account">Test - Delegate(0.001 ATOM)</v-btn>
        
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MathWalletExtension from "./utils/extension";
import StakingProvider from "./utils/stakingProvider";

export default {
  name: 'App',
  data: () => ({
    account: null,
    offlineSigner: null,
    validators: []
  }), mounted() {
    this.provider = new StakingProvider("https://cosmos.maiziqianbao.net/rpc");
  },
  methods: {
    loginAction() {
  
      MathWalletExtension.getAccount().then(({account, offlineSigner}) => {
        this.account = account;
        this.offlineSigner = offlineSigner;
        this.getStakingData();
      }).catch(e => {
        alert(e.message || "Unknown error");
      });
    },
    getStakingData() {
      this.provider.stakingDatas(this.account.address).then(validators => {
        this.validators = validators;
      }).catch(e => {
        alert(e.message || "Unknown error");
      });
    },
    undelegateAction(validator) {
      this.provider.undelegate(validator.delegatorAddress, validator.validatorAddress, validator.balance.amount, this.offlineSigner).then(txResp => {
        console.log(txResp);
      }).catch(e => {
        alert(e.message || "Unknown error");
      });
    },
    delegateAction() {
      this.provider.delegate(this.account.address, "cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0", "1000", this.offlineSigner).then(txResp => {
        console.log(txResp);
      }).catch(e => {
        alert(e.message || "Unknown error");
      });
    }
  }
};
</script>
