var appPath = window.AppPath;
/**
 * TOP椤甸潰JavaScript鏂囦欢
 * 
 * 鍔熻兘锛?
 * - 鍔犺浇璇勫垎澶т簬绛変簬48鍒嗙殑浣滃搧
 * - 鎸夌被鍨嬪垎绫绘樉绀?
 * - 浼橀泤鐨勯〉闈㈠垏鎹㈠姩鐢?
 * - 杩斿洖涓婚〉鍔熻兘
 */

// 椤甸潰鍒濆鍖?
$(function() {
    // 娣诲姞椤甸潰杩涘叆鍔ㄧ敾
    $('.top-main-container').addClass('page-enter');
    
    // 鍔犺浇TOP浣滃搧鏁版嵁
    loadTopWorks();
    
    // 缁戝畾杩斿洖鎸夐挳浜嬩欢
    $('#backBtn').on('click', function() {
        goBackToMain();
    });

    // 缁戝畾澶撮儴杩斿洖鎸夐挳浜嬩欢
    $('#headerBackBtn').on('click', function() {
        goBackToMain();
    });
});

/**
 * 鍔犺浇TOP浣滃搧鏁版嵁
 */
function loadTopWorks() {
    // 鏄剧ず鍔犺浇鐘舵€?
    showLoadingStates();
    
    // 鍔犺浇鍚勭被鍨嬬殑TOP浣滃搧
    loadTopWorksByType('Anime', '#animeCards');
    loadTopWorksByType('Comic', '#comicCards');
    loadTopWorksByType('Game', '#gameCards');
    loadTopWorksByType('Novel', '#novelCards');
}

/**
 * 鏄剧ず鍔犺浇鐘舵€?
 */
function showLoadingStates() {
    $('#animeCards').html('<div class="loading-state">鍔犺浇涓?..</div>');
    $('#comicCards').html('<div class="loading-state">鍔犺浇涓?..</div>');
    $('#gameCards').html('<div class="loading-state">鍔犺浇涓?..</div>');
    $('#novelCards').html('<div class="loading-state">鍔犺浇涓?..</div>');
}

/**
 * 鏍规嵁绫诲瀷鍔犺浇TOP浣滃搧
 * @param {string} type 浣滃搧绫诲瀷
 * @param {string} containerId 瀹瑰櫒ID
 */
function loadTopWorksByType(type, containerId) {
    $.ajax({
        url: appPath.api('/top/works'),
        method: 'GET',
        data: { type: type },
        success: function(response) {
            if (response.success) {
                renderTopCards(response.data, containerId);
            } else {
                showEmptyState(containerId, '鍔犺浇澶辫触');
            }
        },
        error: function() {
            showEmptyState(containerId, '鍔犺浇澶辫触');
        }
    });
}

/**
 * 娓叉煋TOP鍗＄墖
 * @param {Array} works 浣滃搧鏁扮粍
 * @param {string} containerId 瀹瑰櫒ID
 */
function renderTopCards(works, containerId) {
    if (!works || works.length === 0) {
        showEmptyState(containerId, '鏆傛棤TOP浣滃搧');
        return;
    }
    // 鍙繚鐣欏悓绫诲瀷鍚屽悕涓椂鏈熸渶鏃╃殑閭ｄ竴鏉?
    works = filterTopWorksByExactName(works);
    var html = '';
    works.forEach(function(work) {
        html += `
            <div class="top-card">
                <div class="top-card-title">${work.name}</div>
                <div class="top-card-score">
                    <span class="top-star-icon">鈽?/span>
                    <span class="top-score-value">${work.score}</span>
                </div>
                <div class="top-card-date">瑙傜湅鏃ユ湡锛?{work.period}</div>
            </div>
        `;
    });
    $(containerId).html(html);
}

// 杩囨护鍑芥暟锛氬悓绫诲瀷鍚屽悕鍙繚鐣欐渶鏃?
function filterTopWorksByExactName(works) {
    const map = {};
    works.forEach(work => {
        const key = work.type + '|' + work.name;
        if (!map[key] || (work.period < map[key].period)) {
            map[key] = work;
        }
    });
    return Object.values(map);
}

/**
 * 鏄剧ず绌虹姸鎬?
 * @param {string} containerId 瀹瑰櫒ID
 * @param {string} message 娑堟伅
 */
function showEmptyState(containerId, message) {
    $(containerId).html(`<div class="empty-state">${message}</div>`);
}

/**
 * 杩斿洖涓婚〉
 * 浣跨敤浼橀泤鐨勬贰鍑?缂╂斁鍔ㄧ敾鏁堟灉
 */
function goBackToMain() {
    // 鍒涘缓閬僵灞?
    var $overlay = $('<div class="page-transition-overlay"></div>');
    $('body').append($overlay);
    
    // 娣诲姞椤甸潰鍒囨崲鍔ㄧ敾
    $('.top-main-container').addClass('page-transition');
    
    // 寤惰繜璺宠浆锛岃鍔ㄧ敾鏁堟灉瀹屾垚
    setTimeout(function() {
        window.location.href = appPath.page('main.html');
    }, 800);
}

/**
 * 椤甸潰鍔犺浇瀹屾垚鍚庣殑鍔ㄧ敾鏁堟灉
 */
$(window).on('load', function() {
    // 涓洪〉闈㈡坊鍔犳贰鍏ユ晥鏋?
    $('.top-container').css('opacity', '0').animate({
        opacity: 1
    }, 800);
    
    // 涓烘爣棰樻坊鍔犵壒娈婃晥鏋?
    $('.top-title').addClass('animate-title');
});

// 娣诲姞鏍囬鍔ㄧ敾鏍峰紡
$('<style>')
    .prop('type', 'text/css')
    .html(`
        .animate-title {
            animation: titleGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes titleGlow {
            from {
                text-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            to {
                text-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
            }
        }
    `)
    .appendTo('head'); 
