var appPath = window.AppPath;
/**
 * ACGN浣滃搧灞曠ず绯荤粺 - 涓婚〉闈avaScript鏂囦欢
 * 
 * 鏂囦欢鍔熻兘锛? * - 绠＄悊椤甸潰鐨勬墍鏈変氦浜掗€昏緫
 * - 澶勭悊鏁版嵁鍔犺浇銆佹帓搴忋€佺紪杈戠瓑鍔熻兘
 * - 鎺у埗椤甸潰鐘舵€佸拰UI鏇存柊
 * 
 * 鎶€鏈爤锛? * - jQuery: DOM鎿嶄綔鍜孉JAX璇锋眰
 * - ECharts: 鍥捐〃娓叉煋
 * - Bootstrap: UI缁勪欢鍜屾牱寮? * 
 * 鏁版嵁娴佸悜锛? * - 鏁版嵁鏉ユ簮锛氬悗绔疭ervlet API
 * - 鏁版嵁澶勭悊锛欽avaScript鍙橀噺鍜屽嚱鏁? * - 鏁版嵁灞曠ず锛欻TML DOM鍏冪礌
 * 
 * 涓昏妯″潡锛? * 1. 鍏ㄥ眬鍙橀噺绠＄悊
 * 2. 浜嬩欢缁戝畾鍜屽鐞? * 3. 鏁版嵁鍔犺浇鍜屾覆鏌? * 4. 鎺掑簭鍔熻兘
 * 5. 缂栬緫妯″紡鍔熻兘
 * 6. 鍥捐〃灞曠ず
 */

// ==================== 鍏ㄥ眬鍙橀噺瀹氫箟 ====================

/**
 * 褰撳墠鏃堕棿娈碉紝鏍煎紡涓?骞翠唤+瀛ｈ妭"锛屽"2024绉?
 * 鏁版嵁鏉ユ簮锛氱敤鎴烽€夋嫨锛屾暟鎹祦鍑猴細浼犻€掔粰鍚庣API
 */
var currentPeriod = '2024绉?;

/**
 * 褰撳墠浣滃搧绫诲瀷锛?:鍔ㄧ敾, 1:婕敾, 2:娓告垙, 3:灏忚
 * 鏁版嵁鏉ユ簮锛氱敤鎴风偣鍑荤被鍨嬫寜閽紝鏁版嵁娴佸嚭锛氫紶閫掔粰鍚庣API
 */
var currentType = 0;

/**
 * 褰撳墠閫夋嫨鐨勫勾浠斤紝濡?2024"
 * 鏁版嵁鏉ユ簮锛氬勾浠戒笅鎷夋閫夋嫨锛屾暟鎹祦鍑猴細鏇存柊currentPeriod
 */
var currentYear = 2024;

/**
 * 褰撳墠閫夋嫨鐨勫鑺傦紝濡?绉?
 * 鏁版嵁鏉ユ簮锛氬鑺傛寜閽偣鍑伙紝鏁版嵁娴佸嚭锛氭洿鏂癱urrentPeriod
 */
var currentSeason = '绉?;

/**
 * 鏌辩姸鍥炬樉绀烘ā寮忥紝'season'琛ㄧず鎸夊鑺傜粺璁★紝'year'琛ㄧず鎸夊勾浠界粺璁? * 鏁版嵁鏉ユ簮锛氱敤鎴风偣鍑诲垏鎹㈡寜閽紝鏁版嵁娴佸嚭锛氫紶閫掔粰鍥捐〃娓叉煋鍑芥暟
 */
var currentBarMode = 'season';

/**
 * 淇濆瓨鍙敤鐨勬椂闂存鏁版嵁锛屽寘鍚勾浠姐€佸鑺傘€佺被鍨嬬瓑淇℃伅
 * 鏁版嵁鏉ユ簮锛氬悗绔疭tatsServlet锛屾暟鎹祦鍑猴細鍔ㄦ€佹洿鏂癠I鎸夐挳鐘舵€? */
var availableData = null;

/**
 * 缂栬緫妯″紡鐘舵€侊紝true琛ㄧず杩涘叆缂栬緫妯″紡锛宖alse琛ㄧず姝ｅ父妯″紡
 * 鏁版嵁鏉ユ簮锛氱紪杈戞寜閽偣鍑伙紝鏁版嵁娴佸嚭锛氭帶鍒禪I鏄剧ず鍜屼氦浜? */
var isEditMode = false;

/**
 * 褰撳墠缂栬緫鐨勯」鐩紝瀛樺偍姝ｅ湪缂栬緫鐨勪綔鍝佷俊鎭? * 鏁版嵁鏉ユ簮锛氱偣鍑讳綔鍝佸崱鐗囷紝鏁版嵁娴佸嚭锛氱紪杈戝脊绐楄〃鍗? */
var currentEditingItem = null;

/**
 * 鍏ㄥ眬鍙橀噺
 * 褰撳墠缂栬緫鐨勯」鐩甀D锛岀敤浜庣紪杈戞椂甯︿笂ID
 */
var currentEditingItemId = null;

/**
 * 褰撳墠鐧诲綍鐢ㄦ埛鍚? * 鏁版嵁鏉ユ簮锛氬悗绔疭ession锛屾暟鎹祦鍑猴細鏄剧ず鍦ㄦ杩庝俊鎭腑
 */
var currentUsername = 'admin';

// 绫诲瀷瀛楃涓叉槧灏?var typeStrArr = ['Anime', 'Comic', 'Game', 'Novel'];

var currentWorkList = [];

// 鎺掑簭绫诲瀷锛岄粯璁や负璇勫垎闄嶅簭
var currentSortType = 'score-desc';

// 鏇存柊褰撳墠鏃堕棿娈垫樉绀?function updateCurrentPeriod() {
    currentPeriod = currentYear + currentSeason;
    $('#currentPeriodDisplay').text(currentPeriod);
}

/**
 * 鑾峰彇骞舵樉绀哄綋鍓嶇敤鎴峰悕
 * 
 * 鍔熻兘璇存槑锛? * - 浠庡悗绔幏鍙栧綋鍓嶇櫥褰曠敤鎴蜂俊鎭? * - 鏇存柊椤甸潰涓婄殑娆㈣繋淇℃伅鏄剧ず
 * 
 * 鏁版嵁娴佸悜锛? * - 杈撳叆锛欰JAX璇锋眰鍒?getCurrentUser
 * - 澶勭悊锛氳В鏋愯繑鍥炵殑鐢ㄦ埛淇℃伅
 * - 杈撳嚭锛氭洿鏂伴〉闈笂鐨勭敤鎴峰悕鏄剧ず
 */
function loadCurrentUser() {
    $.getJSON(appPath.api('/getCurrentUser'), function(data) {
        if (data.success && data.username) {
            currentUsername = data.username;
            $('#currentUsername').text(currentUsername);
        }
    }).fail(function() {
        // 濡傛灉鑾峰彇澶辫触锛屼娇鐢ㄩ粯璁ょ敤鎴峰悕
        $('#currentUsername').text('admin');
    });
}

// 鏍规嵁瀛ｈ妭鏇存柊鑳屾櫙
function updateBackgroundBySeason() {
    // 绉婚櫎鎵€鏈夊鑺傝儗鏅被
    $('body').removeClass('spring-bg summer-bg autumn-bg winter-bg');
    
    // 娣诲姞瀵瑰簲瀛ｈ妭鐨勮儗鏅被
    switch(currentSeason) {
        case '鏄?:
            $('body').addClass('spring-bg');
            break;
        case '澶?:
            $('body').addClass('summer-bg');
            break;
        case '绉?:
            $('body').addClass('autumn-bg');
            break;
        case '鍐?:
            $('body').addClass('winter-bg');
            break;
    }
}

/**
 * 鍔犺浇鍙敤鐨勬椂闂存鏁版嵁
 * 
 * 鍔熻兘璇存槑锛? * - 浠庡悗绔幏鍙栧彲鐢ㄧ殑骞翠唤銆佸鑺傘€佺被鍨嬫暟鎹? * - 鐢ㄤ簬鍔ㄦ€佹洿鏂癠I鎸夐挳鐘舵€侊紝绂佺敤鏃犳暟鎹殑閫夐」
 * 
 * 鏁版嵁娴佸悜锛? * - 杈撳叆锛欰JAX璇锋眰鍒?stats/availablePeriods
 * - 澶勭悊锛氳В鏋愯繑鍥炵殑JSON鏁版嵁
 * - 杈撳嚭锛氭洿鏂癮vailableData鍙橀噺锛岃皟鐢╨oadYearOptions鍜寀pdateButtonStates
 * 
 * 杩斿洖鏁版嵁鏍煎紡锛? * {
 *   "availableYears": ["2022", "2023", "2024"],
 *   "yearSeasons": {
 *     "2024": ["鏄?, "澶?, "绉?],
 *     "2023": ["鏄?, "澶?, "绉?, "鍐?]
 *   },
 *   "yearSeasonTypes": {
 *     "2024": {
 *       "鏄?: [0, 1, 2],
 *       "澶?: [0, 1, 2, 3]
 *     }
 *   }
 * }
 * 
 * 璋冪敤鏃舵満锛? * - 椤甸潰鍒濆鍖栨椂
 * - 骞翠唤閫夋嫨鏀瑰彉鏃? */
function loadAvailableData() {
    // 鍙戦€丄JAX璇锋眰鑾峰彇鍙敤鏁版嵁
    $.getJSON(appPath.api('/stats/availablePeriods'), function(data) {
        // 淇濆瓨杩斿洖鐨勬暟鎹埌鍏ㄥ眬鍙橀噺
        availableData = data;
        
        // 鍔ㄦ€佸姞杞藉勾浠介€夐」鍒颁笅鎷夋
        loadYearOptions();
        
        // 鏇存柊鎸夐挳鐘舵€侊紙鍚敤/绂佺敤锛?        updateButtonStates();
    }).fail(function() {
        // 濡傛灉鍔犺浇澶辫触锛屼娇鐢ㄩ粯璁よ缃?        loadYearOptions();
    });
}

// 鍔ㄦ€佸姞杞藉勾浠介€夐」
function loadYearOptions() {
    var years = availableData ? availableData.availableYears : ['2022', '2023', '2024', '2025'];
    
    var $select = $('#yearSelect');
    $select.empty();
    
    years.forEach(function(year) {
        $select.append('<option value="' + year + '">' + year + '</option>');
    });
    
    // 璁剧疆褰撳墠骞翠唤
    if (years.includes(currentYear.toString())) {
        $select.val(currentYear);
    } else if (years.length > 0) {
        currentYear = parseInt(years[0]);
        $select.val(currentYear);
    updateCurrentPeriod();
    }
}

// 鏇存柊鎸夐挳鐘舵€?function updateButtonStates() {
    updateSeasonButtonStates();
    updateTypeButtonStates();
}

// 鏇存柊瀛ｈ妭鎸夐挳鐘舵€?function updateSeasonButtonStates() {
    if (!availableData || !availableData.yearSeasons) return;
    
    var yearSeasons = availableData.yearSeasons[currentYear];
    if (!yearSeasons) return;
    
    $('.season-btn').each(function() {
        var season = $(this).data('season');
        if (yearSeasons.includes(season)) {
            $(this).removeClass('disabled');
        } else {
            $(this).addClass('disabled');
        }
    });
}

// 鏇存柊绫诲瀷鎸夐挳鐘舵€?function updateTypeButtonStates() {
    if (!availableData || !availableData.yearSeasonTypes) return;
    var yearSeasonTypes = availableData.yearSeasonTypes[currentYear];
    // 淇锛氬鏋滃綋鍓嶅鑺傛病鏈変换浣曠被鍨嬶紝鍏ㄩ儴缃伆
    if (!yearSeasonTypes || !yearSeasonTypes[currentSeason]) {
        $('.type-btn').addClass('disabled');
        return;
    }
    var currentSeasonTypes = yearSeasonTypes[currentSeason];
    $('.type-btn').each(function() {
        var typeIndex = parseInt($(this).data('type'));
        if (currentSeasonTypes.includes(typeIndex)) {
            $(this).removeClass('disabled');
        } else {
            $(this).addClass('disabled');
        }
    });
}

// 浜嬩欢缁戝畾
function bindEvents() {
    // 骞翠唤閫夋嫨浜嬩欢缁戝畾
    $('#yearSelect').off('change').on('change', function(){
        currentYear = $(this).val();
        updateCurrentPeriod();
        updateButtonStates();
        loadPieChart();
        loadBarChart();
        loadContent(currentType);
    });

    // 瀛ｈ妭閫夋嫨浜嬩欢缁戝畾
    $('.season-btn').off('click').on('click', function(){
        $('.season-btn').removeClass('active');
        $(this).addClass('active');
        currentSeason = $(this).data('season');
        updateCurrentPeriod();
        updateBackgroundBySeason();
        updateTypeButtonStates();
        loadPieChart();
        loadBarChart();
        loadContent(currentType);
    });

    // 绫诲瀷鍒囨崲浜嬩欢缁戝畾
    $('.type-btn').off('click').on('click', function(){
        // 鍏佽缃伆鎸夐挳涔熻兘鍒囨崲绫诲瀷
        $('.type-btn').removeClass('active');
        $(this).addClass('active');
        currentType = parseInt($(this).data('type'));
        loadPieChart();
        loadContent(currentType);
    });

    // 鏌辩姸鍥炬ā寮忓垏鎹簨浠剁粦瀹?    $('.toggle-btn').off('click').on('click', function(){
        $('.toggle-btn').removeClass('active');
        $(this).addClass('active');
        currentBarMode = $(this).data('mode');
        loadBarChart();
    });

    // 缂栬緫妯″紡鎸夐挳浜嬩欢濮旀墭锛屼繚璇佹瘡娆℃覆鏌撻兘鑳界敓鏁?    $(document).off('click', '#editModeBtn').on('click', '#editModeBtn', function(){
        isEditMode = !isEditMode;
        renderWorkList(currentWorkList);
    });

    // 缂栬緫寮圭獥浜嬩欢缁戝畾
    $('#editModalClose, #editCancelBtn').off('click').on('click', function(){
        closeEditModal();
    });

    // 缂栬緫琛ㄥ崟鎻愪氦浜嬩欢
    $('#editForm').off('submit').on('submit', function(e){
        e.preventDefault();
        saveEditForm();
    });

    // 缂栬緫寮圭獥绫诲瀷鎸夐挳鐐瑰嚮浜嬩欢
    $(document).off('click', '.edit-type-btn').on('click', '.edit-type-btn', function(){
        $('.edit-type-btn').removeClass('active');
        $(this).addClass('active');
        $('#editType').val($(this).data('type'));
    });

    // 缂栬緫寮圭獥瀛ｈ妭鎸夐挳鐐瑰嚮浜嬩欢
    $(document).off('click', '.season-btn').on('click', '.season-btn', function(){
        $('.season-btn').removeClass('active');
        $(this).addClass('active');
        $('#editSeason').val($(this).data('season'));
    });

    // 纭鍒犻櫎寮圭獥浜嬩欢缁戝畾
    $('#confirmCancelBtn').off('click').on('click', function(){
        closeConfirmModal();
    });

    $('#confirmDeleteBtn').off('click').on('click', function(){
        confirmDelete();
    });

    // 鐐瑰嚮寮圭獥鑳屾櫙鍏抽棴
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

    // TOP鎸夐挳鐐瑰嚮浜嬩欢
    $('#topBtn').off('click').on('click', function(){
        goToTopPage();
    });

    // 鎼滅储鎸夐挳鐐瑰嚮浜嬩欢
    $('#searchBtn').off('click').on('click', function(){
        goToSearchPage();
    });

    // 閫€鍑虹櫥褰曟寜閽彧鍋歭ogout
    $('#logoutBtn').off('click').on('click', function() {
        showLogoutConfirmModal();
    });

    // 閫€鍑虹櫥褰曠‘璁ゅ脊绐椾簨浠剁粦瀹?    $('#logoutCancelBtn').off('click').on('click', function(){
        closeLogoutConfirmModal();
    });

    $('#logoutConfirmBtn').off('click').on('click', function(){
        closeLogoutConfirmModal();
        logout();
    });

    // 閫€鍑虹櫥褰曠‘璁ゅ脊绐楃偣鍑婚伄缃╁叧闂?    $('#logoutConfirmModal').off('click').on('click', function(e){
        if (e.target === this) {
            closeLogoutConfirmModal();
        }
    });

    // 鎺掑簭鎸夐挳鐐瑰嚮浜嬩欢锛堜富椤典笓鐢級
    $(document).off('click', '.sort-btn').on('click', '.sort-btn', function() {
        $('.sort-btn').removeClass('active');
        $(this).addClass('active');
        currentSortType = $(this).data('sort');
        renderWorkList(currentWorkList);
    });
}

// 楗肩姸鍥炬覆鏌?- 浠庢暟鎹簱鑾峰彇鏁版嵁
function loadPieChart() {
    // 浠庢暟鎹簱鑾峰彇鏁版嵁
    $.getJSON(appPath.api('/stats/seasonDistribution'), {
        year: currentYear,
        type: typeStrArr[currentType]
    }, function(data) {
        var chart = echarts.init(document.getElementById('pieChartArea'));
        
        // 妫€娴嬫槸鍚︿负鎵嬫満绔?        var isMobile = window.innerWidth <= 390;
        
        // 缁熶竴瀛ｈ妭棰滆壊
        var seasonColorMap = {
            '鏄?: '#ffb6c1', // 绮夎壊
            '澶?: '#ffb347', // 姗欒壊
            '绉?: '#c97b63', // 妫曡壊
            '鍐?: '#90caf9'  // 钃濊壊
        };
        var colorArr = data.map(function(item) {
            // item.name 鍙兘鏄?2024鏄?锛屽彇鏈€鍚庝竴涓瓧
            var season = item.name[item.name.length-1];
            return seasonColorMap[season] || '#cccccc';
        });
        
        var option = {
            title: {
                text: currentYear + '骞? + getTypeName(currentType) + '瀛ｈ妭鍒嗗竷',
                left: 'center',
                top: isMobile ? 5 : 10,
                textStyle: { 
                    fontSize: isMobile ? 12 : 14, 
                    fontWeight: 'bold' 
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: isMobile ? 'horizontal' : 'vertical',
                left: isMobile ? 'center' : 'left',
                top: isMobile ? 'bottom' : 'middle',
                formatter: function(name) {
                    var item = data.find(function(d) { return d.name === name; });
                    return item ? name + ' (' + item.percentage + '%)' : name;
                },
                textStyle: {
                    fontSize: isMobile ? 10 : 12
                }
            },
            series: [{
                name: '瀛ｈ妭鍒嗗竷',
                type: 'pie',
                radius: isMobile ? '50%' : '60%',
                center: isMobile ? ['50%', '45%'] : ['60%', '60%'],
                avoidLabelOverlap: false,
                label: { show: false, position: 'center' },
                emphasis: {
                    label: { 
                        show: true, 
                        fontSize: isMobile ? '14' : '18', 
                        fontWeight: 'bold' 
                    }
                },
                labelLine: { show: false },
                data: data,
                color: colorArr
            }]
        };
        
        chart.setOption(option);
        
        // 娣诲姞楗肩姸鍥剧偣鍑讳簨浠?        chart.on('click', function(params) {
            if (params.componentType === 'series') {
                var season = params.name;
                
                // 浠庡畬鏁寸殑瀛ｈ妭鍚嶇О涓彁鍙栧鑺傞儴鍒嗭紙濡?2024鍐? -> "鍐?锛?                var seasonPart = season.replace(/\d+/g, ''); // 绉婚櫎鎵€鏈夋暟瀛?                
                // 鍒囨崲鍒板搴斿鑺?                switch(seasonPart) {
                    case '鏄?:
                        $('.season-btn[data-season="鏄?]').click();
                        break;
                    case '澶?:
                        $('.season-btn[data-season="澶?]').click();
                        break;
                    case '绉?:
                        $('.season-btn[data-season="绉?]').click();
                        break;
                    case '鍐?:
                        $('.season-btn[data-season="鍐?]').click();
                        break;
                }
            }
        });
        
        // 鐩戝惉绐楀彛澶у皬鍙樺寲锛岄噸鏂拌皟鏁村浘琛?        window.addEventListener('resize', function() {
            chart.resize();
        });
    }).fail(function() {
        // 濡傛灉API澶辫触锛屾樉绀洪敊璇俊鎭?        $("#pieChartArea").html("<div style='text-align:center;color:#6c757d;padding:50px;'>鏁版嵁鍔犺浇澶辫触</div>");
    });
}

// 鏌辩姸鍥炬覆鏌?function loadBarChart() {
    var url = currentBarMode === 'season' ? 
        appPath.api('/stats/seasonTypeCount') : 
        appPath.api('/stats/yearTypeCount');
    
    var params = currentBarMode === 'season' ? 
        { year: currentYear, season: currentSeason } : 
        { year: currentYear };
    
    $.getJSON(url, params, function(data) {
        var chart = echarts.init(document.getElementById('barChartArea'));
        
        // 妫€娴嬫槸鍚︿负鎵嬫満绔?        var isMobile = window.innerWidth <= 390;
        
        var xAxisData = currentBarMode === 'season' ? 
            ['鍔ㄧ敾', '婕敾', '娓告垙', '灏忚'] : 
            ['鍔ㄧ敾', '婕敾', '娓告垙', '灏忚'];
        
        var option = {
            title: {
                text: currentBarMode === 'season' ? 
                    currentYear + '骞? + currentSeason + '鍚勭被鍨嬫暟閲? : 
                    currentYear + '骞村悇绫诲瀷鏁伴噺',
                left: 'center',
                top: isMobile ? 5 : 10,
                textStyle: { 
                    fontSize: isMobile ? 12 : 14, 
                    fontWeight: 'bold' 
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: {
                left: isMobile ? '10%' : '15%',
                right: isMobile ? '10%' : '15%',
                top: isMobile ? '20%' : '25%',
                bottom: isMobile ? '15%' : '20%'
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLabel: { 
                    fontSize: isMobile ? 10 : 12,
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: { 
                    fontSize: isMobile ? 10 : 12
                }
            },
            series: [{
                name: '鏁伴噺',
                type: 'bar',
                data: data,
                itemStyle: {
                    color: function(params) {
                        var colors = ['#2196f3', '#9c27b0', '#4caf50', '#ff9800'];
                        return colors[params.dataIndex];
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    fontSize: isMobile ? 10 : 12
                }
            }]
        };
        
        chart.setOption(option);
        
        // 娣诲姞鏌辩姸鍥剧偣鍑讳簨浠?        chart.on('click', function(params) {
            if (params.componentType === 'series') {
                var typeIndex = params.dataIndex;
                // 鍒囨崲鍒板搴斾綔鍝佺被鍨?                $('.type-btn[data-type="' + typeIndex + '"]').click();
            }
        });
        
        // 鐩戝惉绐楀彛澶у皬鍙樺寲锛岄噸鏂拌皟鏁村浘琛?        window.addEventListener('resize', function() {
            chart.resize();
        });
    }).fail(function() {
        $("#barChartArea").html("<div style='text-align:center;color:#6c757d;padding:50px;'>鏁版嵁鍔犺浇澶辫触</div>");
    });
}

// 鑾峰彇绫诲瀷鍚嶇О
function getTypeName(type) {
    var names = ['鍔ㄧ敾', '婕敾', '娓告垙', '灏忚'];
    return names[type] || '浣滃搧';
}

// 鑾峰彇绫诲瀷鏍囪瘑绗?function getTypeIdentifier(type) {
    var identifiers = ['anime', 'comic', 'game', 'novel'];
    return identifiers[type] || 'work';
}

// 娓叉煋浣滃搧鍒楄〃
function renderWorkList(list) {
    var typeName = typeStrArr[currentType] || 'Work';
    var typeId = ['anime', 'comic', 'game', 'novel'][currentType] || 'work';
    // 缁熶竴娓叉煋澶撮儴
    var html = `
        <div class="content-header" data-type="${currentType}">
            <div class="type-title-row">
                <h2 class="type-title">${typeName}</h2>
            </div>
            <div class="period-subtitle">${currentPeriod}</div>
            <div class="sort-section">
                <div class="sort-buttons">
                    <button class="sort-btn${currentSortType==='score-desc'?' active':''}" data-sort="score-desc">璇勫垎闄嶅簭</button>
                    <button class="sort-btn${currentSortType==='score-asc'?' active':''}" data-sort="score-asc">璇勫垎鍗囧簭</button>
                    <button class="sort-btn${currentSortType==='period-asc'?' active':''}" data-sort="period-asc">鏃堕棿鍗囧簭</button>
                    <button class="sort-btn${currentSortType==='period-desc'?' active':''}" data-sort="period-desc">鏃堕棿闄嶅簭</button>
                </div>
                <div class="edit-controls">
                    <button id="editModeBtn" class="btn btn-danger btn-lg edit-mode-btn${isEditMode ? ' active' : ''}">
                        <i class="glyphicon glyphicon-${isEditMode ? 'ok' : 'edit'}"></i>
                        ${isEditMode ? '閫€鍑轰慨鏀规ā寮? : '淇敼妯″紡'}
                    </button>
                </div>
            </div>
        </div>
        <div class="row card-area" id="${typeId}Row">`;
    // 鍐呭鍖?    if (!list || list.length === 0) {
        html += `<div class='empty-state-container'>
            <div class='empty-state-title'>鏆傛棤鏁版嵁</div>
            <div class='empty-state-message'>鍦?${currentPeriod} 鏃堕棿娈靛唴娌℃湁鎵惧埌 ${typeName} 绫诲瀷鐨勪綔鍝?/div>
            <div class='empty-state-suggestion'>璇曡瘯鍏朵粬鏃堕棿娈垫垨浣滃搧绫诲瀷鍚</div>
        </div>`;
        if (isEditMode) {
            html += `<div class="col-md-4 col-sm-6">
                <div class="add-card" onclick="openEditModal(null, true)">
                    <div class="add-icon">+</div>
                </div>
            </div>`;
        }
        html += '</div>';
        $("#contentArea").html(html);
        if (isEditMode) {
            $('.card-area').addClass('edit-mode');
        } else {
            $('.card-area').removeClass('edit-mode');
        }
        return;
    }
    
    // 鎺掑簭閫昏緫
    let sortedList = [...list];
    switch(currentSortType) {
        case 'score-desc':
            sortedList.sort((a, b) => b.score - a.score);
            break;
        case 'score-asc':
            sortedList.sort((a, b) => a.score - b.score);
            break;
        case 'period-asc':
            // 鏃堕棿鍗囧簭锛氱洿鎺ョ敤鏁版嵁搴撹繑鍥為『搴忥紝涓嶆帓搴?            break;
        case 'period-desc':
            // 鏃堕棿闄嶅簭锛氱洿鎺ュ弽杞?            sortedList.reverse();
            break;
        default:
    }
    
    sortedList.forEach(function(item) {
        html += `
            <div class="col-md-4 col-sm-6">
                <div class="work-card" data-score="${item.score}" data-period="${item.period}" data-id="${item.id}">
                    ${isEditMode ? '<button class="delete-btn" data-id="' + item.id + '" data-name="' + item.name + '">&times;</button>' : ''}
                    <div class="work-title">${item.name}</div>
                    <div class="work-meta">
                        <div class="work-score">
                            <span class="star-icon">鈽?/span>
                            ${item.score}
                        </div>
                    </div>
                    <div class="work-actions">
                        <a href="https://bangumi.tv/subject_search/${encodeURIComponent(item.name)}" target="_blank" class="external-link-btn bangumi-btn">
                            <img src="${appPath.asset('/images/faviconBan.ico')}" alt="Bangumi" class="favicon-icon">
                        </a>
                        <a href="https://zh.moegirl.org.cn/${encodeURIComponent(item.name)}" target="_blank" class="external-link-btn moegirl-btn">
                            <img src="${appPath.asset('/images/faviconMoe.ico')}" alt="萌娘百科" class="favicon-icon">
                        </a>
                    </div>
                </div>
            </div>`;
    });
    if (isEditMode) {
        html += `
            <div class="col-md-4 col-sm-6">
                <div class="add-card" onclick="openEditModal(null, true)">
                    <div class="add-icon">+</div>
                </div>
            </div>`;
    }
    html += '</div>';
    $("#contentArea").html(html);
    if (isEditMode) {
        $('.card-area').addClass('edit-mode');
    } else {
        $('.card-area').removeClass('edit-mode');
    }
    if (isEditMode) {
        $('.work-card').off('click').on('click', function(e) {
            if (!$(e.target).hasClass('delete-btn')) {
                var cardData = {
                    id: parseInt($(this).data('id')),
                    name: $(this).find('.work-title').text(),
                    score: parseFloat($(this).find('.work-score').text().replace('鈽?, '').trim()),
                    period: $(this).data('period'),
                    type: currentType
                };
                openEditModal(cardData);
            }
        });
        $('.delete-btn').off('click').on('click', function(e) {
            e.stopPropagation();
            var item = {
                id: parseInt($(this).data('id')),
                name: $(this).data('name')
            };
            deleteWork(item);
        });
    }
}

/**
 * 缁熶竴鍔犺浇浣滃搧鍐呭
 * @param {number} typeIdx 浣滃搧绫诲瀷缂栧彿
 */
function loadContent(typeIdx) {
    var period = currentPeriod;
    currentType = typeIdx;
    var typeStr = typeStrArr[typeIdx];
    
    // 鏋勫缓璇锋眰鍙傛暟
    var params = { period: period, type: typeStr };
    
    // 鏍规嵁鎺掑簭绫诲瀷娣诲姞鎺掑簭鍙傛暟
    if (currentSortType === 'period-desc') {
        params.sort = 'time_desc'; // 鏃堕棿鍊掑簭
    }
    // 鏃堕棿椤哄簭锛坧eriod-asc锛変笉浼爏ort鍙傛暟锛屼娇鐢ㄨ嚜鐒堕『搴?    
    $("#contentArea").html("<div class='loading-state'>鍔犺浇涓?..</div>");
    $.getJSON(appPath.api('/work/list'), params, function(list) {
        currentWorkList = list || [];
        renderWorkList(currentWorkList);
    }).fail(function(xhr, status, error) {
        $("#contentArea").html("<div class='empty-state'>鍔犺浇澶辫触</div>");
    });
}

// 鍥炲埌椤堕儴鍔熻兘
function initBackToTop() {
    // 鍒涘缓鍥炲埌椤堕儴鎸夐挳
    $('body').append('<button class="back-to-top" title="鍥炲埌椤堕儴">鈫?/button>');
    
    // 鐩戝惉婊氬姩浜嬩欢
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').addClass('show');
        } else {
            $('.back-to-top').removeClass('show');
        }
    });
    
    // 鐐瑰嚮鍥炲埌椤堕儴 - 鍔犲揩閫熷害
    $('.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 400); // 浠?00ms鏀逛负400ms
    });
}

// 椤甸潰鍒濆鍖?$(function(){
    // 鍏堢粦瀹氫簨浠?    bindEvents();
    
    // 鍔犺浇鍙敤鏁版嵁锛岀劧鍚庡垵濮嬪寲鍏朵粬鍔熻兘
    loadAvailableData();
    
    // 绛夊緟鍙敤鏁版嵁鍔犺浇瀹屾垚鍚庡垵濮嬪寲鍏朵粬鍔熻兘
    var initInterval = setInterval(function() {
        if (availableData) {
            clearInterval(initInterval);
            
            // 璁剧疆榛樿鑳屾櫙
            updateBackgroundBySeason();
            
            // 纭繚鍔ㄧ敾鎸夐挳澶勪簬婵€娲荤姸鎬?            $('.type-btn[data-type="0"]').addClass('active');
            
            // 鍔犺浇鍥捐〃鍜屽唴瀹?            loadPieChart();
            loadBarChart();
            loadContent(0);
            initBackToTop();
            loadCurrentUser();
        }
    }, 100);
});

// 缂栬緫妯″紡鐩稿叧鍑芥暟

// 鎵撳紑缂栬緫寮圭獥
function openEditModal(item, isNew = false) {
    $('#editModal').addClass('show');
    // 绫诲瀷鎸夐挳缁?    var type = isNew ? currentType : (item && typeof item.type !== 'undefined' ? item.type : currentType);
    $('.edit-type-btn').removeClass('active');
    $('.edit-type-btn[data-type="' + type + '"]').addClass('active');
    $('#editType').val(type);
    // 瀛ｈ妭鎸夐挳缁?    var season = isNew ? currentSeason : (item && item.period ? item.period.slice(-1) : currentSeason);
    $('.season-btn').removeClass('active');
    $('.season-btn[data-season="' + season + '"]').addClass('active');
    $('#editSeason').val(season);
    // 鍏朵粬瀛楁
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

// 鍏抽棴缂栬緫寮圭獥
function closeEditModal() {
    $('#editModal').removeClass('show');
    currentEditingItem = null;
}

// 淇濆瓨缂栬緫琛ㄥ崟
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

// 鏇存柊浣滃搧椤圭洰
function updateWorkItem(formData) {
    $.ajax({
        url: appPath.api('/updateWork'),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success) {
                closeEditModal();
                // 鍒锋柊鍙敤鏁版嵁
                loadAvailableData();
                // 閲嶆柊鍔犺浇鍐呭
                loadContent(currentType);
                // 绔嬪嵆鍒锋柊缁熻鍥捐〃
                loadPieChart();
                loadBarChart();
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

// 娣诲姞鏂颁綔鍝?function addNewWork(formData) {
    $.ajax({
        url: appPath.api('/addWork'),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success) {
                closeEditModal();
                // 鍒锋柊鍙敤鏁版嵁
                loadAvailableData();
                // 閲嶆柊鍔犺浇鍐呭
                loadContent(currentType);
                // 绔嬪嵆鍒锋柊缁熻鍥捐〃
                loadPieChart();
                loadBarChart();
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

// 鍒犻櫎浣滃搧
function deleteWork(item) {
    currentEditingItem = item;
    $('#confirmMessage').text('纭畾瑕佸垹闄や綔鍝?' + item.name + '"鍚楋紵');
    $('#confirmModal').addClass('show');
}

// 纭鍒犻櫎
function confirmDelete() {
    if (!currentEditingItem) return;
    
    $.ajax({
        url: appPath.api('/deleteWork'),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(currentEditingItem),
        success: function(response) {
            if (response.success) {
                closeConfirmModal();
                // 鍒锋柊鍙敤鏁版嵁
                loadAvailableData();
                // 閲嶆柊鍔犺浇鍐呭
                loadContent(currentType);
                // 绔嬪嵆鍒锋柊缁熻鍥捐〃
                loadPieChart();
                loadBarChart();
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

// 鍏抽棴纭鍒犻櫎寮圭獥
function closeConfirmModal() {
    $('#confirmModal').removeClass('show');
    currentEditingItem = null;
}

// 鏄剧ず鎴愬姛娑堟伅
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

// 鏄剧ず閿欒娑堟伅
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
    }, 5000);
}

// 璺宠浆鍒癟OP椤甸潰
function goToTopPage() {
    // 娣诲姞椤甸潰鍒囨崲鍔ㄧ敾
    $('.main-container').addClass('page-transition');
    
    // 寤惰繜璺宠浆锛岃鍔ㄧ敾鏁堟灉瀹屾垚
    setTimeout(function() {
        window.location.href = appPath.page('top.html');
    }, 800);
}

// 璺宠浆鍒版悳绱㈤〉闈?function goToSearchPage() {
    // 娣诲姞椤甸潰鍒囨崲鍔ㄧ敾
    $('.main-container').addClass('page-transition');
    
    // 寤惰繜璺宠浆锛岃鍔ㄧ敾鏁堟灉瀹屾垚
    setTimeout(function() {
        window.location.href = appPath.page('search.html');
    }, 800);
}

// 閫€鍑虹櫥褰?function logout() {
    $.getJSON(appPath.api('/logout'), function(response) {
        if (response.success) {
            window.location.href = appPath.page('login.html');
        } else {
            showErrorMessage('閫€鍑虹櫥褰曞け璐ワ紝璇烽噸璇?);
        }
    }).fail(function() {
        showErrorMessage('缃戠粶閿欒锛岃妫€鏌ヨ繛鎺?);
    });
}

// 閫€鍑虹櫥褰曠‘璁ゅ脊绐楃浉鍏冲嚱鏁?
// 鏄剧ず閫€鍑虹櫥褰曠‘璁ゅ脊绐?function showLogoutConfirmModal() {
    $('#logoutConfirmModal').addClass('show');
}

// 鍏抽棴閫€鍑虹櫥褰曠‘璁ゅ脊绐?function closeLogoutConfirmModal() {
    $('#logoutConfirmModal').removeClass('show');
} 

