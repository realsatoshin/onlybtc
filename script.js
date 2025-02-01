document.addEventListener('DOMContentLoaded', async function() {
    // DOM 요소
    const elements = {
        upbitPrice: document.getElementById('upbit-price'),
        binancePrice: document.getElementById('binance-price'),
        exchangeRate: document.getElementById('exchange-rate'),
        kimchiPremium: document.getElementById('kimchi-premium'),
        btcDominance: document.getElementById('btc-dominance'),
        btcMined: document.getElementById('btc-mined'),
        btcRemaining: document.getElementById('btc-remaining'),
        fearGreedScore: document.getElementById('fear-greed-score'),
        fearGreedImage: document.getElementById('fear-greed-image'),
        toggleMode: document.getElementById('toggle-mode'),
        tradingviewChart: document.getElementById('tradingview-chart')
    };

    // 데이터 가져오기
    async function fetchData() {
        try {
            // 모든 값을 로딩으로 변경
            Object.values(elements).forEach(el => {
                if (el && el.tagName !== 'IFRAME' && el.tagName !== 'BUTTON' && el.tagName !== 'IMG') {
                    el.textContent = '로딩 중...';
                }
            });

            // API 요청
            const [upbitRes, binanceRes, exchangeRes, btcInfoRes, dominanceRes, fearGreedRes] = await Promise.all([
                fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC'),
                fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
                fetch('https://api.exchangerate-api.com/v4/latest/USD'),
                fetch('https://api.blockchain.info/q/totalbc'),
                fetch('https://api.coingecko.com/api/v3/global'),
                fetch('https://api.alternative.me/fng/?limit=1')
            ]);

            // 데이터 추출
            const upbitData = await upbitRes.json();
            const binanceData = await binanceRes.json();
            const exchangeData = await exchangeRes.json();
            const btcInfoData = await btcInfoRes.json();
            const dominanceData = await dominanceRes.json();
            const fearGreedData = await fearGreedRes.json();

            // 값 계산
            const upbitPrice = upbitData[0].trade_price;
            const binancePrice = parseFloat(binanceData.price);
            const exchangeRate = exchangeData.rates.KRW;
            const kimchiPremium = ((upbitPrice / (binancePrice * exchangeRate)) - 1) * 100;
            const totalBtcMined = btcInfoData / 100000000;
            const btcRemaining = 21000000 - totalBtcMined;
            const btcDominance = dominanceData.data.market_cap_percentage.btc;
            
            // 화면 업데이트
            elements.upbitPrice.textContent = `${upbitPrice.toLocaleString()} KRW`;
            elements.binancePrice.textContent = `${binancePrice.toLocaleString()} USD`;
            elements.exchangeRate.textContent = exchangeRate.toFixed(2);
            elements.kimchiPremium.textContent = `${kimchiPremium.toFixed(2)}%`;
            elements.btcMined.textContent = `${totalBtcMined.toLocaleString()} BTC`;
            elements.btcRemaining.textContent = `${btcRemaining.toLocaleString()} BTC`;
            elements.btcDominance.textContent = `${btcDominance.toFixed(2)}%`;
            elements.fearGreedScore.textContent = fearGreedData.data[0].value;
            elements.fearGreedImage.src = `https://alternative.me/crypto/fear-and-greed-index.png?${Date.now()}`;

            // 타이틀 업데이트
            document.title = `BTC $${binancePrice.toLocaleString()} | ₩${upbitPrice.toLocaleString()}`;

        } catch (error) {
            console.error('데이터 가져오기 오류:', error);
            const errorMessage = '데이터 로드 실패';
            Object.values(elements).forEach(el => {
                if (el && el.tagName !== 'IFRAME' && el.tagName !== 'BUTTON' && el.tagName !== 'IMG') {
                    el.textContent = errorMessage;
                }
            });
        }
    }

    // 테마 전환
    function toggleTheme() {
        const body = document.body;
        const isDarkMode = body.classList.contains('dark-mode');
        
        // 테마 전환
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        
        // 버튼 아이콘 변경
        elements.toggleMode.innerHTML = isDarkMode ? 
            '<i class="fas fa-moon"></i>' : 
            '<i class="fas fa-sun"></i>';
        
        // 차트 테마 업데이트
        const chartTheme = isDarkMode ? 'light' : 'dark';
        elements.tradingviewChart.src = elements.tradingviewChart.src.replace(
            /theme=\w+/, 
            `theme=${chartTheme}`
        );
        
        // 공포/탐욕 이미지 필터
        elements.fearGreedImage.style.filter = isDarkMode ? 'invert(0)' : 'invert(1)';
    }

    // 초기화
    function init() {
        // 초기 테마 설정
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.add(prefersDark ? 'dark-mode' : 'light-mode');
        elements.toggleMode.innerHTML = prefersDark ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';

        // 이벤트 리스너
        elements.toggleMode.addEventListener('click', toggleTheme);

        // 초기 데이터 로드
        fetchData();
        
        // 자동 업데이트 (10초)
        setInterval(fetchData, 10000);
    }

    init();
});
    // DOM 요소 가져오기
    const elements = {
        upbitPrice: document.getElementById('upbit-price'),
        binancePrice: document.getElementById('binance-price'),
        exchangeRate: document.getElementById('exchange-rate'),
        kimchiPremium: document.getElementById('kimchi-premium'),
        btcMined: document.getElementById('btc-mined'),
        btcRemaining: document.getElementById('btc-remaining'),
        btcDominance: document.getElementById('btc-dominance'),
        fearGreedScore: document.getElementById('fear-greed-score'),
        fearGreedImage: document.getElementById('fear-greed-image'),
        toggleMode: document.getElementById('toggle-mode'),
        tradingviewChart: document.getElementById('tradingview-chart')
    };

    // 로딩 상태 관리
    function setLoading(isLoading) {
        Object.values(elements).forEach(el => {
            if (el && el.tagName !== 'IFRAME' && el.tagName !== 'BUTTON' && el.tagName !== 'IMG') {
                el.textContent = isLoading ? '로딩 중...' : el.textContent;
            }
        });
    }

    // 테마 전환 관리
    function toggleTheme() {
        const body = document.body;
        const isDarkMode = body.classList.contains('dark-mode');
        const moonIcon = '<i class="fas fa-moon"></i>';
        const sunIcon = '<i class="fas fa-sun"></i>';

        if (isDarkMode) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            elements.toggleMode.innerHTML = moonIcon;
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            elements.toggleMode.innerHTML = sunIcon;
        }

        // TradingView 차트 테마 업데이트
        const newTheme = isDarkMode ? 'light' : 'dark';
        const chartUrl = elements.tradingviewChart.src.replace(/theme=\w+/, `theme=${newTheme}`);
        elements.tradingviewChart.src = chartUrl;
    }


// 기본 :  아작스  > 패치 말고 > 제이쿼리 아작스 > 리액트 엑시오스



    // 기본 모드는 다크 모드
    if (document.body.classList.contains('dark-mode')) {
        toggleModeBtn.textContent = '라이트 모드';
    } else {
        toggleModeBtn.textContent = '다크 모드';
    }

    function setLoading(isLoading) {
        const elements = document.querySelectorAll('.price-info span');
        elements.forEach(el => {
            el.textContent = isLoading ? '로딩 중...' : el.textContent;
        });
    }

    // 테마 전환 관리
    function toggleTheme() {
        const body = document.body;
        const isDarkMode = body.classList.contains('dark-mode');
        const moonIcon = '<i class="fas fa-moon"></i>';
        const sunIcon = '<i class="fas fa-sun"></i>';

        if (isDarkMode) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            elements.toggleMode.innerHTML = moonIcon;
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            elements.toggleMode.innerHTML = sunIcon;
        }

        // TradingView 차트 테마 업데이트
        const newTheme = isDarkMode ? 'light' : 'dark';
        const chartUrl = elements.tradingviewChart.src.replace(/theme=\w+/, `theme=${newTheme}`);
        elements.tradingviewChart.src = chartUrl;
    }

    async function fetchData() {
        setLoading(true);
        try {
            const upbitResponse = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
            const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
            const exchangeRateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const btcInfoResponse = await fetch('https://api.blockchain.info/q/totalbc');
            const btcDominanceResponse = await fetch('https://api.coingecko.com/api/v3/global');
            const fearGreedResponse = await fetch('https://api.alternative.me/fng/?limit=1');

            if (!upbitResponse.ok || !binanceResponse.ok || !exchangeRateResponse.ok || !btcInfoResponse.ok || !btcDominanceResponse.ok || !fearGreedResponse.ok) {
                throw new Error('API 요청 실패');
            }

            const upbitData = await upbitResponse.json();
            const binanceData = await binanceResponse.json();
            const exchangeRateData = await exchangeRateResponse.json();
            const btcInfoData = await btcInfoResponse.json();
            const btcDominanceData = await btcDominanceResponse.json();
            const fearGreedData = await fearGreedResponse.json();

            const upbitPrice = upbitData[0].trade_price;
            const binancePrice = binanceData.price;
            const exchangeRate = exchangeRateData.rates.KRW;

            const kimchiPremium = ((upbitPrice / (binancePrice * exchangeRate)) - 1) * 100;

            const totalBtcMined = btcInfoData / 100000000;
            const totalBtcSupply = 21000000;
            const btcRemaining = totalBtcSupply - totalBtcMined;

            const btcDominance = btcDominanceData.data.market_cap_percentage.btc.toFixed(2);
            const fearGreedIndex = fearGreedData.data[0].value;

            const fearGreedImage = `https://alternative.me/crypto/fear-and-greed-index.png?${new Date().getTime()}`;

            elements.upbitPrice.textContent = `${upbitPrice.toLocaleString()} KRW`;
            elements.binancePrice.textContent = `${parseFloat(binancePrice).toFixed(2)} USD`;
            elements.exchangeRate.textContent = exchangeRate.toFixed(2);
            elements.kimchiPremium.textContent = `${kimchiPremium.toFixed(2)}%`;
            elements.btcMined.textContent = `${totalBtcMined.toLocaleString()} BTC`;
            elements.btcRemaining.textContent = `${btcRemaining.toLocaleString()} BTC`;
            elements.btcDominance.textContent = `${btcDominance}%`;
            elements.fearGreedScore.textContent = `${fearGreedIndex}`;
            elements.fearGreedImage.src = fearGreedImage;
            
            // 타이틀 업데이트
            document.title = `BTC $${parseFloat(binancePrice).toLocaleString()} | ₩${upbitPrice.toLocaleString()}`;

            // 테마에 따라 이미지 필터 적용
            if (document.body.classList.contains('dark-mode')) {
                elements.fearGreedImage.style.filter = 'invert(1)';
            } else {
                elements.fearGreedImage.style.filter = 'invert(0)';
            }

            // 브라우저 타이틀 업데이트
            document.title = `BTC $${parseFloat(binancePrice).toLocaleString()} | ₩${upbitPrice.toLocaleString()} | ${originalTitle}`;

            // 다크 모드일 경우 이미지 색상 반전
            if (document.body.classList.contains('dark-mode')) {
                fearGreedImageEl.style.filter = 'invert(1)';
            } else {
                fearGreedImageEl.style.filter = 'invert(0)';
            }

        } catch (error) {
            console.error('데이터 가져오기 오류:', error);
            const errorMessage = '데이터 로드 실패';
            Object.values(elements).forEach(el => {
                if (el && el.tagName !== 'IFRAME' && el.tagName !== 'BUTTON' && el.tagName !== 'IMG') {
                    el.textContent = errorMessage;
                }
            });
        } finally {
            setLoading(false);
        }
        }
    }

    fetchData();
    setInterval(fetchData, 10000); // 10초마다 데이터 갱신

    // 초기 테마 설정
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        document.body.classList.add('dark-mode');
        elements.toggleMode.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.add('light-mode');
        elements.toggleMode.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // 테마 전환 버튼 이벤트 리스너
    elements.toggleMode.addEventListener('click', toggleTheme);

        if (body.classList.contains('dark-mode')) {
            toggleModeBtn.textContent = '라이트 모드';
            tradingviewChart.src = tradingviewChart.src.replace("theme=light", "theme=dark");
            fearGreedImageEl.style.filter = 'invert(1)';
        } else {
            toggleModeBtn.textContent = '다크 모드';
            tradingviewChart.src = tradingviewChart.src.replace("theme=dark", "theme=light");
            fearGreedImageEl.style.filter = 'invert(0)';
        }
    });
});