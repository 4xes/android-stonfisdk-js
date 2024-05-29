import TonWeb from "tonweb";
import {
    DEX,
    pTON
} from "@ston-fi/sdk";

window.payloadBase64 = async function(payload) {
    return await btoa(String.fromCharCode.apply(null, await payload.toBoc()))
}

window.toArgs = async function(address, txParams) {
    let to = txParams.to.toString(!0, !0, !0);
    let amount = txParams.gasAmount.toString();
    let payload = await payloadBase64(txParams.payload)
    let valid_until = Date.now() + 86400000
    return {
        "source": address,
        "valid_until": valid_until,
        "messages": [{
            "address": to,
            "amount": amount,
            "payload": payload
        }]
    }
}

window.buildSwapTonToJettonTxParams = async function(address, askJettonAddress, offerAmount, minAskAmount) {
    const router = new DEX.v1.Router({
        tonApiClient: new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '648c370270ce03dc4ed65ce09d67cd859a4c051f84e6626431114405b6a16400'}),
    });

    // swap 1 TON to STON but not less than 1 nano STON
    var txParams = await router.buildSwapTonToJettonTxParams({
        userWalletAddress: address, //
        proxyTonAddress: pTON.v1.address,
        offerAmount: new TonWeb.utils.BN(offerAmount),
        askJettonAddress: askJettonAddress, // STON
        minAskAmount: new TonWeb.utils.BN(minAskAmount),
        queryId: 12345,
    });

    let args = await toArgs(address, txParams);
    console.log(args);
    window.tonkeeperStonfi.sendTransaction(args);
    return args;
};

window.buildSwapJettonToJettonTxParams = async function(address, offerJettonAddress, askJettonAddress, offerAmount, minAskAmount) {
    const router = new DEX.v1.Router({
        tonApiClient: new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '648c370270ce03dc4ed65ce09d67cd859a4c051f84e6626431114405b6a16400'}),
    });

    // swap 1 TON to STON but not less than 1 nano STON
    var txParams = await router.buildSwapJettonToJettonTxParams({
        userWalletAddress: address, //
        proxyTonAddress: pTON.v1.address,
        offerJettonAddress: offerJettonAddress,
        offerAmount: new TonWeb.utils.BN(offerAmount),
        askJettonAddress: askJettonAddress, // STON
        minAskAmount: new TonWeb.utils.BN(minAskAmount),
        queryId: 12345,
    });

    let args = await toArgs(address, txParams);
    console.log(args);
    window.tonkeeperStonfi.sendTransaction(args);
    return args;
};

window.buildSwapJettonToTonTxParams = async function(address, offerJettonAddress, offerAmount, minAskAmount) {
    const router = new DEX.v1.Router({
        tonApiClient: new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '648c370270ce03dc4ed65ce09d67cd859a4c051f84e6626431114405b6a16400'}),
    });

    const txParams = await router.buildSwapJettonToTonTxParams({
      userWalletAddress: address,
      offerJettonAddress: offerJettonAddress,
      offerAmount: new TonWeb.utils.BN(offerAmount),
      proxyTonAddress: pTON.v1.address,
      minAskAmount: new TonWeb.utils.BN(minAskAmount),
      queryId: 12345,
    });

    let args = await toArgs(address, txParams);
    console.log(args);
    window.tonkeeperStonfi.sendTransaction(args);
    return args;
};