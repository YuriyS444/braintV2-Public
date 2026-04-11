async function processPayment(level, price, ownerWallet) {
    if (!price || price <= 0) return null;

    if (!wallet) {
        await connectWallet();
        if (!wallet) return null;
    }

    const confirmed = confirm(
        `💳 Оплата уровня ${level}

` +
        `Сумма: ${price} USDC
` +
        `Сеть: Polygon
` +
        `Получатель: ${ownerWallet}

` +
        `Продолжить?`
    );
    if (!confirmed) return null;

    try {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x89' }]
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x89',
                        chainName: 'Polygon',
                        nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
                        rpcUrls: ['https://polygon-rpc.com'],
                        blockExplorerUrls: ['https://polygonscan.com']
                    }]
                });
            } else {
                throw switchError;
            }
        }

        const USDC_CONTRACT = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';

        const usdcAmount = Math.floor(price * 1e6);
        const amountHex = usdcAmount.toString(16).padStart(64, '0');
        const recipientHex = ownerWallet.slice(2).padStart(64, '0');

        const data = '0xa9059cbb' + recipientHex + amountHex;

        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: wallet,
                to: USDC_CONTRACT,
                value: '0x0',
                data
            }]
        });

        showNotification('⏳ Ожидание подтверждения...', 'info');

        await new Promise(r => setTimeout(r, 6000));

        const confirmRes = await fetch(`${CONFIG.API_URL}/api/payments/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                tx_hash: txHash,
                level
            })
        });

        const confirmData = await confirmRes.json();

        if (!confirmRes.ok) {
            throw new Error(confirmData.error || 'Payment confirm failed');
        }

        if (!confirmData.success && !confirmData.reused) {
            throw new Error(confirmData.error || 'Payment not confirmed');
        }

        showNotification('✅ Платёж подтверждён', 'success');
        return txHash;

    } catch (error) {
        if (error.code === 4001) {
            showNotification('Платёж отменён', 'info');
        } else {
            showNotification('❌ Ошибка оплаты: ' + error.message, 'error');
        }
        return null;
    }
}
