var appPath = window.AppPath;
$(document).ready(function() {

    
    // 椤甸潰鍔犺浇鍔ㄧ敾
    $('.search-container').addClass('page-enter');
    
    // 鍒濆鍖栫瓫閫夋潯浠?    initFilters();
    
    // 鍔犺浇骞翠唤鏁版嵁
    loadYearOptions();
    
    // 缁戝畾浜嬩欢鐩戝惉鍣?    bindEventListeners();
    
    // 缁戝畾缂栬緫寮圭獥浜嬩欢
    bindEditModalEvents();
    
    // 鍒濆鍖栨悳绱?    performSearch();
    
});

// 鍏ㄥ眬鍙橀噺淇濆瓨褰撳墠鎼滅储缁撴灉鍜屾帓搴忔柟寮?let currentSearchResults = [];
let currentSortType = 'score-desc';
let currentPage = 1;
let pageSize = 15; // 榛樿姣忛〉15鏉?let totalPages = 0;
let totalItems = 0;

// ========== 缂栬緫妯″紡鐩稿叧鍙橀噺 ==========
let isEditMode = false;
let currentEditingItem = null;
let currentEditingItemId = null;
let currentType = 0;
let currentYear = new Date().getFullYear();
let currentSeason = '鏄?;
const typeStrArr = ['Anime', 'Comic', 'Game', 'Novel'];

// ========== 鍏ㄩ€夊姛鑳界浉鍏冲彉閲?==========
let allFilteredWorkIds = []; // 瀛樺偍褰撳墠绛涢€夋潯浠朵笅鐨勬墍鏈変綔鍝両D
let selectedWorkIds = new Set(); // 瀛樺偍宸查€変腑鐨勪綔鍝両D

// 鍒濆鍖栫瓫閫夋潯浠?function initFilters() {
    // 榛樿鎵€鏈夌瓫閫夋潯浠堕兘鏄湭婵€娲荤姸鎬?    $('.filter-group').removeClass('active');
    $('.filter-checkbox').prop('checked', false);
    $('.filter-option').removeClass('selected');
    
    // 璁剧疆榛樿璇勫垎鑼冨洿
    $('#minScore').val(0);
    $('#maxScore').val(50);
}

// 鍔犺浇骞翠唤閫夐」
function loadYearOptions() {
    $.ajax({
        url: appPath.api('/api/years'),
        method: 'GET',
        success: function(response) {
            if (response.success && response.data) {
                const yearOptions = $('#yearOptions');
                yearOptions.empty();
                
                response.data.forEach(year => {
                    const yearBtn = $(`<button class="filter-option" data-value="${year}">${year}</button>`);
                    yearOptions.append(yearBtn);
                });
            }
        },
        error: function() {

        }
    });
}

// 缁戝畾浜嬩欢鐩戝惉鍣?function bindEventListeners() {
    // 绛涢€夋潯浠跺紑鍏?    $('.filter-checkbox').on('change', function() {
        const filterGroup = $(this).closest('.filter-group');
        if ($(this).is(':checked')) {
            filterGroup.addClass('active');
        } else {
            filterGroup.removeClass('active');
            // 娓呴櫎璇ョ粍鐨勬墍鏈夐€夋嫨
            filterGroup.find('.filter-option').removeClass('selected');
        }
        performSearch();
    });
    
    // 绛涢€夐€夐」鐐瑰嚮
    $(document).on('click', '.filter-option', function() {
        const filterGroup = $(this).closest('.filter-group');
        const checkbox = filterGroup.find('.filter-checkbox');
        
        // 濡傛灉绛涢€夋潯浠舵湭婵€娲伙紝鍏堟縺娲?        if (!checkbox.is(':checked')) {
            checkbox.prop('checked', true);
            filterGroup.addClass('active');
        }
        
        // 鍒囨崲閫夋嫨鐘舵€?        $(this).toggleClass('selected');
        performSearch();
    });
    
    // 璇勫垎鑼冨洿杈撳叆
    $('#minScore, #maxScore').on('input', function() {
        const filterGroup = $(this).closest('.filter-group');
        const checkbox = filterGroup.find('.filter-checkbox');
        
        // 濡傛灉绛涢€夋潯浠舵湭婵€娲伙紝鍏堟縺娲?        if (!checkbox.is(':checked')) {
            checkbox.prop('checked', true);
            filterGroup.addClass('active');
        }
        
        // 寤惰繜鎼滅储锛岄伩鍏嶉绻佽姹?        clearTimeout(window.scoreSearchTimeout);
        window.scoreSearchTimeout = setTimeout(performSearch, 500);
    });
    
    // 鎼滅储妗嗚緭鍏?    $('#searchInput').on('input', function() {
        clearTimeout(window.textSearchTimeout);
        window.textSearchTimeout = setTimeout(performSearch, 500);
    });
    
    // 鎼滅储鎸夐挳鐐瑰嚮
    $('#searchSubmitBtn').on('click', function() {
        performSearch();
    });
    
    // 鍥炶溅閿悳绱?    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            performSearch();
        }
    });
    
    // 杩斿洖鎸夐挳
    $('#backBtn').on('click', function() {
        navigateToMain();
    });

    // 杩斿洖涓婚〉鎸夐挳
    $('#backToMainBtn').on('click', function() {
        navigateToMain();
    });

    // 鎺掑簭鎸夐挳鐐瑰嚮浜嬩欢
    $(document).on('click', '.search-sort-btn', function() {
        $('.search-sort-btn').removeClass('active');
        $(this).addClass('active');
        currentSortType = $(this).data('sort');
        currentPage = 1;
        renderSortedResults();
    });

    // ========== 缂栬緫妯″紡鎸夐挳缁戝畾 ==========
    $(document).on('click', '#editModeBtn', function() {
        isEditMode = !isEditMode;
        const $btn = $(this);
        if (isEditMode) {
            $btn.addClass('active').html('<i class="glyphicon glyphicon-ok"></i> 閫€鍑轰慨鏀规ā寮?);
            $('.search-container').addClass('edit-mode');
        } else {
            $btn.removeClass('active').html('<i class="glyphicon glyphicon-edit"></i> 淇敼妯″紡');
            $('.search-container').removeClass('edit-mode');
            closeEditModal();
            closeConfirmModal();
            // 娓呴櫎鎵€鏈夐€変腑鐘舵€?            selectedWorkIds.clear();
            $('.search-result-card.selected').removeClass('selected');
            $('.search-result-card .checkbox-input').prop('checked', false);
        }
        renderSortedResults();
    });

    // 鍏ㄩ€夋寜閽?    $(document).on('click', '.select-all-btn', function() {
        const $btn = $(this);
        const isAllSelected = selectedWorkIds.size === allFilteredWorkIds.length && allFilteredWorkIds.length > 0;
        
        if (isAllSelected) {
            // 鍏ㄩ儴鍙栨秷閫変腑
            selectedWorkIds.clear();
            $('.checkbox-input').prop('checked', false);
            $('.search-result-card').removeClass('selected');
            $btn.text('鍏ㄩ€?);
        } else {
            // 鍏ㄩ儴閫変腑褰撳墠绛涢€夋潯浠朵笅鐨勬墍鏈変綔鍝?            selectedWorkIds = new Set(allFilteredWorkIds);
            $('.checkbox-input').prop('checked', true);
            $('.search-result-card').addClass('selected');
            $btn.text('鍙栨秷鍏ㄩ€?);
        }
    });

    // 鍕鹃€夋浜嬩欢
    $(document).on('change', '.checkbox-input', function() {
        const $card = $(this).closest('.search-result-card');
        const workId = parseInt($(this).data('id'));
        
        if ($(this).is(':checked')) {
            $card.addClass('selected');
            selectedWorkIds.add(workId);
        } else {
            $card.removeClass('selected');
            selectedWorkIds.delete(workId);
        }
        
        // 鏇存柊鍏ㄩ€夋寜閽姸鎬?        const $selectAllBtn = $('.select-all-btn');
        const isAllSelected = selectedWorkIds.size === allFilteredWorkIds.length && allFilteredWorkIds.length > 0;
        
        if (selectedWorkIds.size === 0) {
            $selectAllBtn.text('鍏ㄩ€?);
        } else if (isAllSelected) {
            $selectAllBtn.text('鍙栨秷鍏ㄩ€?);
        } else {
            $selectAllBtn.text('鍏ㄩ€?);
        }
    });

    // 闃绘鍕鹃€夋鐐瑰嚮浜嬩欢鍐掓场
    $(document).on('click', '.checkbox-input', function(e) {
        e.stopPropagation();
    });

    // 鎵归噺鍒犻櫎
    $(document).on('click', '.batch-delete-btn', function() {
        const selectedIds = Array.from(selectedWorkIds);
        if (selectedIds.length === 0) {
            showCustomModal({title: '鎻愮ず', message: '璇峰厛閫夋嫨瑕佸垹闄ょ殑浣滃搧锛?});
            return;
        }
        // 澶嶇敤confirmModal
        currentEditingItem = { ids: selectedIds };
        $('#confirmMessage').text('纭畾瑕佸垹闄ら€変腑鐨?' + selectedIds.length + ' 涓綔鍝佸悧锛熸鎿嶄綔涓嶅彲鎾ら攢銆?);
        $('#confirmModal').addClass('show');
    });

    // 瀵煎叆CSV锛堢畝鍖栫増鏈細鐩存帴瀵煎叆鍒扮敤鎴锋暟鎹簱琛級
    $(document).on('click', '.import-csv-btn', function() {
        // 鍒涘缓鏂囦欢閫夋嫨妗?        const $input = $('<input type="file" accept=".csv" style="display:none;">');
        $('body').append($input);
        $input.on('change', function(e) {
            const file = e.target.files[0];
            if (!file) {
                $input.remove();
                return;
            }
            // 棰勮CSV鍐呭
            const reader = new FileReader();
            reader.onload = function(evt) {
                const csvContent = evt.target.result;
                const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '').slice(0, 6); // 鍖呭惈琛ㄥご+5琛?                let previewHtml = '<div style="overflow-x:auto;"><table class="csv-preview-table" style="margin:0 auto;min-width:320px;max-width:90vw;border-collapse:collapse;">';
                if (lines.length > 0) {
                    // 瑙ｆ瀽琛ㄥご
                    const headers = lines[0].replace(/(^"|"$)/g, '').split(/","?/);
                    previewHtml += '<thead><tr>';
                    headers.forEach(h => {
                        previewHtml += `<th style=\"padding:4px 8px;font-weight:600;font-size:1rem;border-bottom:1px solid #eee;\">${h}</th>`;
                    });
                    previewHtml += '</tr></thead><tbody>';
                    // 瑙ｆ瀽鏁版嵁琛?                    for (let i = 1; i < lines.length; i++) {
                        const row = lines[i].replace(/(^"|"$)/g, '').split(/","?/);
                        previewHtml += '<tr>';
                        row.forEach((cell, idx) => {
                            if (headers[idx] === '璇勫垎') {
                                // 鍙樉绀烘暣鏁?                                const intScore = parseInt(cell);
                                previewHtml += `<td style=\"padding:4px 8px;text-align:center;\"><span style=\"display:inline-block;min-width:32px;font-weight:600;color:#1976d2;\">${isNaN(intScore) ? cell : intScore}</span></td>`;
                            } else if (headers[idx] === '骞翠唤+瀛ｈ妭') {
                                // 鎷嗗垎骞翠唤鍜屽鑺傦紝鍘婚櫎绌烘牸
                                const match = cell.replace(/\s+/g, '').match(/^(\d{4})([鏄ュ绉嬪啲])$/);
                                if (match) {
                                    const year = match[1];
                                    const season = match[2];
                                    let seasonClass = '';
                                    switch(season) {
                                        case '鏄?: seasonClass = 'season-spring'; break;
                                        case '澶?: seasonClass = 'season-summer'; break;
                                        case '绉?: seasonClass = 'season-autumn'; break;
                                        case '鍐?: seasonClass = 'season-winter'; break;
                                        default: seasonClass = '';
                                    }
                                    previewHtml += `<td style=\"padding:4px 8px;text-align:center;\"><span class=\"search-card-period ${seasonClass}\">${year}${season}</span></td>`;
                                } else {
                                    previewHtml += `<td style=\"padding:4px 8px;text-align:center;\">${cell}</td>`;
                                }
                            } else if (headers[idx] === '绫诲瀷') {
                                // 绫诲瀷涓婚鑹?                                let typeClass = '';
                                switch(cell) {
                                    case 'Anime': typeClass = 'type-anime'; break;
                                    case 'Comic': typeClass = 'type-comic'; break;
                                    case 'Game': typeClass = 'type-game'; break;
                                    case 'Novel': typeClass = 'type-novel'; break;
                                    default: typeClass = '';
                                }
                                previewHtml += `<td style=\"padding:4px 8px;text-align:center;\"><span class=\"search-card-type ${typeClass}\">${cell}</span></td>`;
                            } else {
                                previewHtml += `<td style=\"padding:4px 8px;text-align:center;\">${cell}</td>`;
                            }
                        });
                        previewHtml += '</tr>';
                    }
                    previewHtml += '</tbody>';
                }
                previewHtml += '</table></div>';
                showConfirmModal({
                    title: '瀵煎叆棰勮',
                    message: `${previewHtml}<br>纭畾瑕佸鍏ヨ繖浜涙暟鎹悧锛焋,
                    confirmText: '纭畾瀵煎叆',
                    cancelText: '鍙栨秷',
                    showCancel: true,
                    confirmBtnClass: 'btn-success',
                    onConfirm: function() {
                        const formData = new FormData();
                        formData.append('file', file);
                        $.ajax({
                            url: appPath.api('/importCsv'),
                            method: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(res) {
                                if (res.success) {
                                    showConfirmModal({
                                        title: '瀵煎叆鎴愬姛',
                                        message: '瀵煎叆鎴愬姛锛?,
                                        confirmText: '纭畾',
                                        showCancel: false,
                                        confirmBtnClass: 'btn-success',
                                        onConfirm: function(){ performSearch(); }
                                    });
                                } else {
                                    showConfirmModal({
                                        title: '瀵煎叆澶辫触',
                                        message: '瀵煎叆澶辫触锛? + (res.message || '鏈煡閿欒'),
                                        confirmText: '纭畾',
                                        showCancel: false,
                                        confirmBtnClass: 'btn-danger'
                                    });
                                }
                            },
                            error: function() {
                                showConfirmModal({
                                    title: '瀵煎叆澶辫触',
                                    message: '瀵煎叆澶辫触锛岀綉缁滈敊璇?,
                                    confirmText: '纭畾',
                                    showCancel: false,
                                    confirmBtnClass: 'btn-danger'
                                });
                            }
                        });
                    }
                });
            };
            reader.onerror = function() {
                showConfirmModal({
                    title: '閿欒',
                    message: '鏂囦欢璇诲彇澶辫触锛岃妫€鏌ユ枃浠舵牸寮?,
                    confirmText: '纭畾',
                    showCancel: false,
                    confirmBtnClass: 'btn-danger'
                });
            };
            reader.readAsText(file, 'utf-8');
            $input.remove();
        });
        $input.click();
    });

    // 瀵煎嚭CSV锛堜慨鏀逛负鍙鍑洪€変腑鐨勪綔鍝侊級
    $(document).on('click', '.export-csv-btn', function() {
        const selectedIds = Array.from(selectedWorkIds);
        
        if (selectedIds.length === 0) {
            showCustomModal({title: '鎻愮ず', message: '璇峰厛閫夋嫨瑕佸鍑虹殑浣滃搧锛?});
            return;
        }
        
        // 鏋勫缓URL鍙傛暟
        const params = buildSearchParams();
        let url = appPath.api('/exportCsv?');
        const urlParams = [];
        
        // 娣诲姞閫変腑鐨勪綔鍝両D
        urlParams.push('selectedIds=' + encodeURIComponent(JSON.stringify(selectedIds)));
        
        // 娣诲姞鍏朵粬绛涢€夊弬鏁?        if (params.keyword) {
            urlParams.push('keyword=' + encodeURIComponent(params.keyword));
        }
        
        if (params.filters && params.filters.years && params.filters.years.length > 0) {
            params.filters.years.forEach(year => {
                urlParams.push('years[]=' + encodeURIComponent(year));
            });
        }
        
        if (params.filters && params.filters.seasons && params.filters.seasons.length > 0) {
            params.filters.seasons.forEach(season => {
                urlParams.push('seasons[]=' + encodeURIComponent(season));
            });
        }
        
        if (params.filters && params.filters.types && params.filters.types.length > 0) {
            params.filters.types.forEach(type => {
                urlParams.push('types[]=' + encodeURIComponent(type));
            });
        }
        
        if (params.filters && params.filters.scoreRange) {
            urlParams.push('minScore=' + params.filters.scoreRange.min);
            urlParams.push('maxScore=' + params.filters.scoreRange.max);
        }
        
        url += urlParams.join('&');
        
        // 鍒涘缓闅愯棌a鏍囩涓嬭浇
        const $a = $('<a style="display:none;"></a>');
        $a.attr('href', url);
        $a.attr('download', '浣滃搧瀵煎嚭.csv');
        $('body').append($a);
        $a[0].click();
        setTimeout(() => $a.remove(), 1000);
    });

    // 淇敼鍗＄墖鐐瑰嚮浜嬩欢
    $(document).on('click', '.search-container.edit-mode .search-result-card', function(e) {
        // 鎺掗櫎涓嶅簲璇ヨЕ鍙戠紪杈戝脊绐楃殑鍏冪礌
        if (!$(e.target).hasClass('delete-btn') && 
            !$(e.target).hasClass('checkbox-input') && 
            !$(e.target).closest('.checkbox-container').length &&
            !$(e.target).closest('.delete-btn').length) {
            const cardData = {
                id: parseInt($(this).data('id')),
                name: $(this).find('.result-card-title').text(),
                score: parseFloat($(this).find('.result-card-score-value').text()),
                period: $(this).find('.result-card-period').text(),
                type: getTypeFromText($(this).find('.result-card-type').text())
            };
            openEditModal(cardData);
        }
    });
}

// 鎵ц鎼滅储
function performSearch() {
    const searchParams = buildSearchParams();
    
    // 鏄剧ず鍔犺浇鐘舵€?    showLoadingState();
    
    $.ajax({
        url: appPath.api('/api/search'),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(searchParams),
        success: function(response) {
            if (response.success) {
                displaySearchResults(response.data);
            } else {
                showEmptyState('鎼滅储澶辫触锛岃閲嶈瘯');
            }
        },
        error: function() {
            showEmptyState('缃戠粶閿欒锛岃妫€鏌ヨ繛鎺?);
        }
    });
}

// 鏋勫缓鎼滅储鍙傛暟
function buildSearchParams() {
    const params = {
        keyword: $('#searchInput').val().trim(),
        filters: {}
    };
    
    // 骞翠唤绛涢€?    const yearFilter = $('.filter-group').hasClass('active') && $('#yearFilterToggle').is(':checked');
    if (yearFilter) {
        const selectedYears = $('.filter-group:has(#yearFilterToggle) .filter-option.selected').map(function() {
            return $(this).data('value');
        }).get();
        if (selectedYears.length > 0) {
            params.filters.years = selectedYears;
        }
    }
    
    // 瀛ｈ妭绛涢€?    const seasonFilter = $('.filter-group').hasClass('active') && $('#seasonFilterToggle').is(':checked');
    if (seasonFilter) {
        const selectedSeasons = $('.filter-group:has(#seasonFilterToggle) .filter-option.selected').map(function() {
            return $(this).data('value');
        }).get();
        if (selectedSeasons.length > 0) {
            params.filters.seasons = selectedSeasons;
        }
    }
    
    // 绫诲瀷绛涢€?    const typeFilter = $('.filter-group').hasClass('active') && $('#typeFilterToggle').is(':checked');
    if (typeFilter) {
        const selectedTypes = $('.filter-group:has(#typeFilterToggle) .filter-option.selected').map(function() {
            return $(this).data('value');
        }).get();
        if (selectedTypes.length > 0) {
            params.filters.types = selectedTypes;
        }
    }
    
    // 璇勫垎绛涢€?    const scoreFilter = $('.filter-group').hasClass('active') && $('#scoreFilterToggle').is(':checked');
    if (scoreFilter) {
        const minScore = parseInt($('#minScore').val()) || 0;
        const maxScore = parseInt($('#maxScore').val()) || 50;
        params.filters.scoreRange = { min: minScore, max: maxScore };
    }
    
    return params;
}

// 鏄剧ず鎼滅储缁撴灉
function displaySearchResults(results) {
    currentSearchResults = results || [];
    currentPage = 1;
    
    // 鏇存柊褰撳墠绛涢€夋潯浠朵笅鐨勬墍鏈変綔鍝両D
    allFilteredWorkIds = currentSearchResults.map(work => work.id);
    selectedWorkIds.clear(); // 娓呯┖閫変腑鐘舵€?    
    renderSortedResults();
}

// 娓叉煋鎺掑簭鍚庣殑缁撴灉
function renderSortedResults() {
    let sortedResults = [...currentSearchResults];
    
    // 鎺掑簭
    switch(currentSortType) {
        case 'score-desc':
            sortedResults.sort((a, b) => b.score - a.score);
            break;
        case 'score-asc':
            sortedResults.sort((a, b) => a.score - b.score);
            break;
        case 'period-asc':
            // 鏃堕棿鍗囧簭锛氱洿鎺ョ敤鏁版嵁搴撹繑鍥為『搴忥紝涓嶆帓搴?            break;
        case 'period-desc':
            sortedResults.reverse();
            break;
    }
    
    // 璁＄畻鍒嗛〉淇℃伅
    totalItems = sortedResults.length;
    totalPages = Math.ceil(totalItems / pageSize);
    
    // 纭繚褰撳墠椤靛湪鏈夋晥鑼冨洿鍐?    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
    
    // 鍒嗛〉
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageResults = sortedResults.slice(startIndex, endIndex);
    
    // 娓叉煋澶撮儴鍒?results-header
    let typeName = '浣滃搧';
    if (typeof currentType === 'number') {
        typeName = ['鍔ㄧ敾','婕敾','娓告垙','灏忚'][currentType] || '浣滃搧';
    }
    let headerHtml = `
        <h3 class="results-title">鎼滅储缁撴灉</h3>
        <div class="search-sort-buttons">
            <button class="search-sort-btn${currentSortType==='score-desc'?' active':''}" data-sort="score-desc">璇勫垎闄嶅簭</button>
            <button class="search-sort-btn${currentSortType==='score-asc'?' active':''}" data-sort="score-asc">璇勫垎鍗囧簭</button>
            <button class="search-sort-btn${currentSortType==='period-asc'?' active':''}" data-sort="period-asc">鏃堕棿鍗囧簭</button>
            <button class="search-sort-btn${currentSortType==='period-desc'?' active':''}" data-sort="period-desc">鏃堕棿闄嶅簭</button>
        </div>
        <span class="results-count" id="resultsCount">鍏辨壘鍒?${sortedResults.length} 涓綔鍝?/span>
        ${isEditMode ? `
        <div class="import-export-buttons">
            <div class="select-all-section">
                <button class="select-all-btn">鍏ㄩ€?/button>
            </div>
            <div class="action-buttons">
                <button class="import-csv-btn">瀵煎叆CSV</button>
                <button class="export-csv-btn">瀵煎嚭CSV</button>
                <button class="batch-delete-btn">鎵归噺鍒犻櫎</button>
            </div>
        </div>
        ` : ''}
        <button id="editModeBtn" class="btn btn-danger btn-lg edit-mode-btn${isEditMode ? ' active' : ''}">
            <i class="glyphicon glyphicon-${isEditMode ? 'ok' : 'edit'}"></i> ${isEditMode ? '閫€鍑轰慨鏀规ā寮? : '淇敼妯″紡'}
        </button>
    `;
    // 濡傛灉娌℃湁.results-header鍒欐彃鍏?    if ($('.results-header').length === 0) {
        $('.search-results-section').prepend('<div class="results-header"></div>');
    }
    $('.results-header').html(headerHtml);
    // 娓叉煋鍐呭鍖?    const resultsContainer = $('#searchResults');
    resultsContainer.empty();
    if (pageResults.length === 0) {
        resultsContainer.append('<div class="empty-state">娌℃湁鎵惧埌绗﹀悎鏉′欢鐨勪綔鍝?/div>');
        if (isEditMode) {
            const addCardHtml = `
                <div class="add-card" onclick="openEditModal(null, true)">
                    <div class="add-icon">+</div>
                </div>`;
            resultsContainer.append(addCardHtml);
        }
        return;
    }
    pageResults.forEach(work => {
        const card = createResultCard(work);
        resultsContainer.append(card);
    });
    
    // 娓叉煋鍒嗛〉缁勪欢
    renderPagination();
    
    if (isEditMode) {
        $('.search-result-card').off('click').on('click', function(e) {
            // 鎺掗櫎涓嶅簲璇ヨЕ鍙戠紪杈戝脊绐楃殑鍏冪礌
            if (!$(e.target).hasClass('delete-btn') && 
                !$(e.target).hasClass('checkbox-input') && 
                !$(e.target).closest('.checkbox-container').length &&
                !$(e.target).closest('.delete-btn').length) {
                const cardData = {
                    id: parseInt($(this).data('id')),
                    name: $(this).find('.result-card-title').text(),
                    score: parseFloat($(this).find('.result-card-score-value').text()),
                    period: $(this).find('.result-card-period').text(),
                    type: getTypeFromText($(this).find('.result-card-type').text())
                };
                openEditModal(cardData);
            }
        });
        $('.delete-btn').off('click').on('click', function(e) {
            e.stopPropagation();
            const item = {
                id: parseInt($(this).data('id')),
                name: $(this).data('name')
            };
            deleteWork(item);
        });
        
        // 鏍规嵁selectedWorkIds璁剧疆鍕鹃€夋鐘舵€?        $('.checkbox-input').each(function() {
            const workId = parseInt($(this).data('id'));
            const isSelected = selectedWorkIds.has(workId);
            $(this).prop('checked', isSelected);
            if (isSelected) {
                $(this).closest('.search-result-card').addClass('selected');
            } else {
                $(this).closest('.search-result-card').removeClass('selected');
            }
        });
        
        // 鏇存柊鍏ㄩ€夋寜閽姸鎬?        const $selectAllBtn = $('.select-all-btn');
        const isAllSelected = selectedWorkIds.size === allFilteredWorkIds.length && allFilteredWorkIds.length > 0;
        
        if (selectedWorkIds.size === 0) {
            $selectAllBtn.text('鍏ㄩ€?);
        } else if (isAllSelected) {
            $selectAllBtn.text('鍙栨秷鍏ㄩ€?);
        } else {
            $selectAllBtn.text('鍏ㄩ€?);
        }
    }
}

// 鏍规嵁绫诲瀷鏂囨湰鑾峰彇绫诲瀷绱㈠紩
function getTypeFromText(typeText) {
    const typeMap = {
        '鍔ㄧ敾': 0,
        '婕敾': 1,
        '娓告垙': 2,
        '灏忚': 3
    };
    return typeMap[typeText] || 0;
}

// 娓叉煋鍒嗛〉
function renderPagination() {
    const pagination = $('#searchPagination');
    pagination.empty();
    
    if (totalPages <= 1) {
        // 鍙湁涓€椤垫垨娌℃湁鏁版嵁鏃讹紝鏄剧ず鍒嗛〉淇℃伅浣嗕笉鏄剧ず鍒嗛〉鎺т欢
        pagination.append(`
            <div class="pagination-info">
                <span class="pagination-stats">鍏?${totalItems} 鏉¤褰?/span>
            </div>
        `);
        return;
    }
    
    // 璁＄畻鏄剧ず鐨勯〉鐮佽寖鍥?    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // 纭繚鏄剧ず鑷冲皯5涓〉鐮侊紙濡傛灉鎬婚〉鏁拌冻澶燂級
    if (endPage - startPage < 4 && totalPages > 5) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
    }
    
    // 鏋勫缓鍒嗛〉HTML
    let paginationHtml = `
        <div class="pagination-container">
            <div class="pagination-info">
                <span class="pagination-stats">鍏?${totalItems} 鏉¤褰曪紝绗?${currentPage} / ${totalPages} 椤?/span>
            </div>
            <div class="pagination-controls">
                <ul class="pagination">
    `;
    
    // 棣栭〉鎸夐挳
    if (currentPage > 1) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="1" title="棣栭〉">芦</a></li>`;
    } else {
        paginationHtml += `<li class="page-item disabled"><span class="page-link">芦</span></li>`;
    }
    
    // 涓婁竴椤垫寜閽?    if (currentPage > 1) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}" title="涓婁竴椤?>鈥?/a></li>`;
    } else {
        paginationHtml += `<li class="page-item disabled"><span class="page-link">鈥?/span></li>`;
    }
    
    // 鏄剧ず鐪佺暐鍙凤紙濡傛灉璧峰椤典笉鏄1椤碉級
    if (startPage > 1) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
        if (startPage > 2) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // 椤电爜鎸夐挳
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHtml += `<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
    
    // 鏄剧ず鐪佺暐鍙凤紙濡傛灉缁撴潫椤典笉鏄渶鍚庝竴椤碉級
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
    }
    
    // 涓嬩竴椤垫寜閽?    if (currentPage < totalPages) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}" title="涓嬩竴椤?>鈥?/a></li>`;
    } else {
        paginationHtml += `<li class="page-item disabled"><span class="page-link">鈥?/span></li>`;
    }
    
    // 灏鹃〉鎸夐挳
    if (currentPage < totalPages) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}" title="灏鹃〉">禄</a></li>`;
    } else {
        paginationHtml += `<li class="page-item disabled"><span class="page-link">禄</span></li>`;
    }
    
    paginationHtml += `
                </ul>
            </div>
            <div class="pagination-actions">
                <div class="page-size-selector">
                    <label>姣忛〉鏄剧ず锛?/label>
                    <select class="page-size-select">
                        <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
                        <option value="15" ${pageSize === 15 ? 'selected' : ''}>15</option>
                        <option value="20" ${pageSize === 20 ? 'selected' : ''}>20</option>
                        <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
                    </select>
                </div>
                <div class="page-jump">
                    <label>璺宠浆鍒帮細</label>
                    <input type="number" class="page-jump-input" min="1" max="${totalPages}" value="${currentPage}">
                    <button class="page-jump-btn">璺宠浆</button>
                </div>
            </div>
        </div>
    `;
    
    pagination.html(paginationHtml);
    
    // 缁戝畾鍒嗛〉浜嬩欢
    bindPaginationEvents();
}

// 缁戝畾鍒嗛〉浜嬩欢
function bindPaginationEvents() {
    // 椤电爜鐐瑰嚮浜嬩欢
    $('#searchPagination').off('click', '.page-link').on('click', '.page-link', function(e) {
        e.preventDefault();
        e.stopPropagation(); // 闃绘閿氱偣璺宠浆瀵艰嚧椤甸潰璺冲姩
        const page = parseInt($(this).data('page'));
        if (page && page !== currentPage && page >= 1 && page <= totalPages) {
            currentPage = page;
            renderSortedResults();
        }
    });
    
    // 姣忛〉鏁伴噺閫夋嫨浜嬩欢
    $('#searchPagination').off('change', '.page-size-select').on('change', '.page-size-select', function() {
        const newPageSize = parseInt($(this).val());
        if (newPageSize !== pageSize) {
            pageSize = newPageSize;
            currentPage = 1; // 閲嶇疆鍒扮涓€椤?            renderSortedResults();
        }
    });
    
    // 璺宠浆鎸夐挳浜嬩欢
    $('#searchPagination').off('click', '.page-jump-btn').on('click', '.page-jump-btn', function() {
        const jumpPage = parseInt($('.page-jump-input').val());
        if (jumpPage && jumpPage >= 1 && jumpPage <= totalPages && jumpPage !== currentPage) {
            currentPage = jumpPage;
            renderSortedResults();
        } else {
            // 杈撳叆鏃犳晥锛岄噸缃緭鍏ユ
            $('.page-jump-input').val(currentPage);
        }
    });
    
    // 璺宠浆杈撳叆妗嗗洖杞︿簨浠?    $('#searchPagination').off('keypress', '.page-jump-input').on('keypress', '.page-jump-input', function(e) {
        if (e.which === 13) { // Enter閿?            $('.page-jump-btn').click();
        }
    });
    
    // 璺宠浆杈撳叆妗嗗け鐒︿簨浠?    $('#searchPagination').off('blur', '.page-jump-input').on('blur', '.page-jump-input', function() {
        const inputPage = parseInt($(this).val());
        if (!inputPage || inputPage < 1 || inputPage > totalPages) {
            $(this).val(currentPage);
        }
    });
}

// 鍒涘缓缁撴灉鍗＄墖
function createResultCard(work) {
    // 绫诲瀷class鍜屾枃鏈紝鍏煎鏁板瓧鍜屽瓧绗︿覆
    const typeMap = {
        0: {cls: 'type-anime', text: '鍔ㄧ敾'},
        1: {cls: 'type-comic', text: '婕敾'},
        2: {cls: 'type-game', text: '娓告垙'},
        3: {cls: 'type-novel', text: '灏忚'},
        'Anime': {cls: 'type-anime', text: '鍔ㄧ敾'},
        'Comic': {cls: 'type-comic', text: '婕敾'},
        'Game': {cls: 'type-game', text: '娓告垙'},
        'Novel': {cls: 'type-novel', text: '灏忚'}
    };
    const typeInfo = typeMap[work.type] || {cls: 'type-default', text: work.type||''};
    // 瀛ｈ妭class鍜屾枃鏈?    const seasonMap = {
        '鏄?: 'season-spring',
        '澶?: 'season-summer',
        '绉?: 'season-autumn',
        '鍐?: 'season-winter'
    };
    const season = work.period ? work.period.slice(-1) : '';
    const seasonClass = seasonMap[season] || '';
    
    // 澶栭儴閾炬帴鎸夐挳HTML
    const externalLinksHtml = isEditMode ? '' : `
        <div class="result-card-actions search-card-actions">
            <a href="https://bangumi.tv/subject_search/${encodeURIComponent(work.name)}" target="_blank" class="external-link-btn">
                <img src="${appPath.asset('/images/faviconBan.ico')}" alt="Bangumi" class="favicon-icon">
            </a>
            <a href="https://zh.moegirl.org.cn/${encodeURIComponent(work.name)}" target="_blank" class="external-link-btn">
                <img src="${appPath.asset('/images/faviconMoe.ico')}" alt="萌娘百科" class="favicon-icon">
            </a>
        </div>
    `;
    
    // 鍕鹃€夋HTML
    const checkboxHtml = isEditMode ? `
        <div class="checkbox-container">
            <input type="checkbox" class="checkbox-input" data-id="${work.id}">
        </div>
    ` : '';
    // 鍒犻櫎鎸夐挳HTML
    const deleteBtnHtml = isEditMode ? `<button class="delete-btn" data-id="${work.id}" data-name="${work.name}">&times;</button>` : '';
    
    let cardHtml = `
        <div class="search-result-card ${typeInfo.cls}" data-id="${work.id}">
            ${checkboxHtml}
            ${deleteBtnHtml}
            <div class="result-card-title-row search-card-title-row">
                <div class="result-card-title-center search-card-title-center">
                    <h2 class="result-card-title search-card-title">${work.name}</h2>
                </div>
                ${externalLinksHtml}
            </div>
            <div class="result-card-meta search-card-meta">
                <span class="result-card-type search-card-type ${typeInfo.cls}">${typeInfo.text}</span>
                <span class="result-card-period search-card-period ${seasonClass}">${work.period||''}</span>
            </div>
            <div class="result-card-score-row search-card-score-row">
                <span class="result-card-star search-card-star">鈽?/span>
                <span class="result-card-score-value search-card-score-value-lg">${work.score}</span>
        </div>
        </div>`;
    return cardHtml;
}

// 鑾峰彇绫诲瀷鏍峰紡绫?function getTypeClass(type) {
    const typeMap = {
        'Anime': 'type-anime',
        'Comic': 'type-comic',
        'Game': 'type-game',
        'Novel': 'type-novel'
    };
    return typeMap[type] || 'type-default';
}

// 鑾峰彇绫诲瀷鏂囨湰
function getTypeText(type) {
    const typeMap = {
        'Anime': '鍔ㄧ敾',
        'Comic': '婕敾',
        'Game': '娓告垙',
        'Novel': '灏忚'
    };
    return typeMap[type] || '浣滃搧';
}

// 鏄剧ず鍔犺浇鐘舵€?function showLoadingState() {
    $('#searchResults').html('<div class="loading-state">鎼滅储涓?..</div>');
    $('#resultsCount').text('鎼滅储涓?..');
}

// 鏄剧ず绌虹姸鎬?function showEmptyState(message) {
    $('#searchResults').html(`<div class="empty-state">${message}</div>`);
    $('#resultsCount').text('娌℃湁鎵惧埌浣滃搧');
}

// 瀵艰埅鍒颁富椤?function navigateToMain() {
    // 娣诲姞椤甸潰鍒囨崲鍔ㄧ敾
    $('.search-container').addClass('page-transition');
    
    // 寤惰繜璺宠浆锛岃鍔ㄧ敾瀹屾垚
    setTimeout(function() {
        window.location.href = appPath.page('main.html');
    }, 300);
}

// ========== 缂栬緫寮圭獥鐩稿叧 ==========
function openEditModal(item, isNew = false) {
    $('#editModal').addClass('show');
    let type = isNew ? currentType : (item && typeof item.type !== 'undefined' ? item.type : currentType);
    // 淇锛氬鏋滀紶鍏ョ殑鏄瓧绗︿覆绫诲瀷锛堝'Anime'锛夛紝闇€杞负鏁板瓧
    if (typeof type === 'string' && ['Anime','Comic','Game','Novel'].includes(type)) {
        type = { 'Anime':0, 'Comic':1, 'Game':2, 'Novel':3 }[type];
    }
    $('.type-btn').removeClass('active');
    $('.type-btn[data-type="' + type + '"]').addClass('active');
    $('#editType').val(type);
    let season = isNew ? currentSeason : (item && item.period ? item.period.slice(-1) : currentSeason);
    $('.season-btn').removeClass('active');
    $('.season-btn[data-season="' + season + '"]').addClass('active');
    $('#editSeason').val(season);
    if (isNew) {
        currentEditingItemId = null;
        $('#editModalTitle').text('娣诲姞浣滃搧');
        $('#editYear').val(currentYear);
        $('#editName').val('');
        $('#editScore').val('');
    } else {
        currentEditingItemId = item && item.id ? item.id : null;
        $('#editModalTitle').text('缂栬緫浣滃搧');
        if (item) {
            $('#editName').val(item.name);
            $('#editScore').val(item.score);
            if (item.period && item.period.length >= 5) {
                $('#editYear').val(item.period.substring(0,4));
            } else {
                $('#editYear').val(currentYear);
            }
        }
    }
}

function closeEditModal() {
    $('#editModal').removeClass('show');
    currentEditingItem = null;
}

function saveEditForm() {
    
    var name = $('#editName').val().trim();
    var score = $('#editScore').val().trim();
    var year = $('#editYear').val().trim();
    var season = $('#editSeason').val();
    var type = parseInt($('#editType').val());
    

    
    if (!name) {
        showErrorMessage('浣滃搧鍚嶇О涓嶈兘涓虹┖');
        return;
    }
    if (!/^[0-9]{4}$/.test(year)) {
        showErrorMessage('骞翠唤蹇呴』涓?浣嶆暟瀛?);
        return;
    }
    if (!['鏄?,'澶?,'绉?,'鍐?].includes(season)) {
        showErrorMessage('瀛ｈ妭閫夋嫨涓嶅悎娉?);
        return;
    }
    score = parseInt(score);
    if (isNaN(score) || score < 0 || score > 50) {
        showErrorMessage('璇勫垎蹇呴』涓?-50鐨勬暣鏁?);
        return;
    }
    
    var period = year + season;
    var formData = {
        name: name,
        score: score,
        period: period,
        type: typeStrArr[type]
    };
    
    if ($('#editModalTitle').text().indexOf('缂栬緫') !== -1 && currentEditingItemId) {
        formData.id = currentEditingItemId;
    }
    
    if ($('#editModalTitle').text().indexOf('娣诲姞') !== -1) {
        addNewWork(formData);
    } else {
        updateWorkItem(formData);
    }
}

function deleteWork(item) {
    currentEditingItem = item;
    $('#confirmMessage').text('纭畾瑕佸垹闄や綔鍝?' + item.name + '"鍚楋紵姝ゆ搷浣滀笉鍙挙閿€銆?);
    $('#confirmModal').addClass('show');
}

function closeConfirmModal() {
    $('#confirmModal').removeClass('show');
    currentEditingItem = null;
}

function confirmDelete() {
    if (!currentEditingItem) return;
    // 鍒ゆ柇鏄崟涓繕鏄壒閲?    if (currentEditingItem.ids) {
        // 鎵归噺鍒犻櫎
        $.ajax({
            url: appPath.api('/deleteWork'),
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ids: currentEditingItem.ids }),
            success: function(res) {
                if (res.success) {
                    closeConfirmModal();
                    performSearch();
                    showSuccessMessage('鎵归噺鍒犻櫎鎴愬姛锛?);
                } else {
                    showErrorMessage('鎵归噺鍒犻櫎澶辫触锛? + (res.message || '鏈煡閿欒'));
                }
            },
            error: function() {
                showErrorMessage('鎵归噺鍒犻櫎澶辫触锛岀綉缁滈敊璇?);
            }
        });
    } else {
        // 鍗曚釜鍒犻櫎
        $.ajax({
            url: appPath.api('/deleteWork'),
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id: currentEditingItem.id, type: currentType }),
            success: function(response) {
                if (response.success) {
                    closeConfirmModal();
                    performSearch();
                    showSuccessMessage('浣滃搧鍒犻櫎鎴愬姛锛?);
                } else {
                    showErrorMessage(response.message || '鍒犻櫎澶辫触');
                }
            },
            error: function() {
                showErrorMessage('鏈嶅姟鍣ㄩ敊璇紝璇风◢鍚庨噸璇?);
            }
        });
    }
}

// ========== 缂栬緫/娣诲姞/鏇存柊浣滃搧 ==========
function updateWorkItem(formData) {
    $.ajax({
        url: appPath.api('/updateWork'),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success) {
                closeEditModal();
                // 閲嶆柊鎼滅储浠ヨ幏鍙栨渶鏂版暟鎹紝淇濇寔缂栬緫妯″紡
                performSearch();
                showSuccessMessage('浣滃搧鏇存柊鎴愬姛锛?);
            } else {
                showErrorMessage(response.message || '鏇存柊澶辫触');
            }
        },
        error: function() {
            showErrorMessage('鏈嶅姟鍣ㄩ敊璇紝璇风◢鍚庨噸璇?);
        }
    });
}

function addNewWork(formData) {
    $.ajax({
        url: appPath.api('/addWork'),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success) {
                closeEditModal();
                // 閲嶆柊鎼滅储浠ユ樉绀烘柊娣诲姞鐨勪綔鍝侊紝淇濇寔缂栬緫妯″紡
                performSearch();
                showSuccessMessage('浣滃搧娣诲姞鎴愬姛锛?);
            } else {
                showErrorMessage(response.message || '娣诲姞澶辫触');
            }
        },
        error: function() {
            showErrorMessage('鏈嶅姟鍣ㄩ敊璇紝璇风◢鍚庨噸璇?);
        }
    });
}

// ========== 娑堟伅鏄剧ず鍔熻兘 ==========
function showSuccessMessage(message) {
    // 鍒涘缓鎴愬姛娑堟伅鍏冪礌
    var $message = $('<div class="success-message">' + message + '</div>');
    $('body').append($message);
    
    // 鏄剧ず鍔ㄧ敾
    setTimeout(function() {
        $message.addClass('show');
    }, 100);
    
    // 鑷姩闅愯棌
    setTimeout(function() {
        $message.removeClass('show');
        setTimeout(function() {
            $message.remove();
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    // 鍒涘缓閿欒娑堟伅鍏冪礌
    var $message = $('<div class="error-message">' + message + '</div>');
    $('body').append($message);
    
    // 鏄剧ず鍔ㄧ敾
    setTimeout(function() {
        $message.addClass('show');
    }, 100);
    
    // 鑷姩闅愯棌
    setTimeout(function() {
        $message.removeClass('show');
        setTimeout(function() {
            $message.remove();
        }, 300);
    }, 3000);
}

// ========== 缂栬緫寮圭獥浜嬩欢缁戝畾 ==========
function bindEditModalEvents() {
    // 缂栬緫琛ㄥ崟鎻愪氦浜嬩欢
    $('#editForm').off('submit').on('submit', function(e){
        e.preventDefault();
        saveEditForm();
    });
    
    // 缂栬緫寮圭獥鍏抽棴鎸夐挳浜嬩欢 - 淇鍙栨秷鎸夐挳鏃犲弽搴旈棶棰?    $(document).off('click', '#editModalClose, #editCancelBtn').on('click', '#editModalClose, #editCancelBtn', function(){
        closeEditModal();
    });
    
    // 纭鍒犻櫎寮圭獥浜嬩欢缁戝畾
    $(document).off('click', '#confirmCancelBtn').on('click', '#confirmCancelBtn', function(){
        closeConfirmModal();
    });
    
    $(document).off('click', '#confirmDeleteBtn').on('click', '#confirmDeleteBtn', function(){
        confirmDelete();
    });
    
    // 缂栬緫寮圭獥鐐瑰嚮閬僵鍏抽棴
    $('#editModal').off('click').on('click', function(e){
        if (e.target === this) {
            closeEditModal();
        }
    });
    
    $('#confirmModal').off('click').on('click', function(e){
        if (e.target === this) {
            closeConfirmModal();
        }
    });
    
    // 缂栬緫绫诲瀷/瀛ｈ妭鎸夐挳缁?    $(document).off('click', '.type-btn').on('click', '.type-btn', function() {
        $('.type-btn').removeClass('active');
        $(this).addClass('active');
        $('#editType').val($(this).data('type'));
    });
    
    // 鏂板锛氱紪杈戝脊绐楀鑺傛寜閽粍
    $(document).off('click', '.season-btn').on('click', '.season-btn', function() {
        $('.season-btn').removeClass('active');
        $(this).addClass('active');
        $('#editSeason').val($(this).data('season'));
    });
    
    // 鏂板鍗＄墖鎸夐挳
    $(document).off('click', '.add-card').on('click', '.add-card', function(){
        openEditModal(null, true);
    });
}

function showCustomModal({title, message, showConfirm = true, showCancel = true, confirmText = '纭畾', cancelText = '鍙栨秷', onConfirm, onCancel}) {
    const $modal = $('#customModal');
    $modal.find('.custom-modal-title').text(title || '鎻愮ず');
    $modal.find('.custom-modal-message').html(message || '');
    if (showConfirm) {
        $modal.find('.custom-modal-confirm').show().text(confirmText);
    } else {
        $modal.find('.custom-modal-confirm').hide();
    }
    if (showCancel) {
        $modal.find('.custom-modal-cancel').show().text(cancelText);
    } else {
        $modal.find('.custom-modal-cancel').hide();
    }
    $modal.addClass('show');
    $modal.off('click', '.custom-modal-confirm');
    $modal.off('click', '.custom-modal-cancel');
    $modal.on('click', '.custom-modal-confirm', function() {
        $modal.removeClass('show');
        if (onConfirm) onConfirm();
    });
    $modal.on('click', '.custom-modal-cancel', function() {
        $modal.removeClass('show');
        if (onCancel) onCancel();
    });
}

function hideCustomModal() {
    $('#customModal').removeClass('show');
}

// 鏂板锛氱粺涓€寮圭獥鍑芥暟锛屽鐢╟onfirmModal
function showConfirmModal({title, message, confirmText = '纭畾', cancelText = '鍙栨秷', showCancel = true, onConfirm, onCancel, confirmBtnClass = 'btn-danger'}) {
    const $modal = $('#confirmModal');
    $modal.find('.confirm-modal-title').text(title || '鎻愮ず');
    $modal.find('.confirm-modal-message').html(message || '');
    const $confirmBtn = $('#confirmDeleteBtn');
    $confirmBtn.text(confirmText).removeClass().addClass('btn ' + confirmBtnClass);
    if (showCancel) {
        $('#confirmCancelBtn').show().text(cancelText);
    } else {
        $('#confirmCancelBtn').hide();
    }
    $modal.addClass('show');
    $confirmBtn.off('click').on('click', function() {
        $modal.removeClass('show');
        if (onConfirm) onConfirm();
    });
    $('#confirmCancelBtn').off('click').on('click', function() {
        $modal.removeClass('show');
        if (onCancel) onCancel();
    });
} 

