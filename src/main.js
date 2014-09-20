var qrDefalut = {
    render: 'image',
    mode: 2,
    ecLevel: 'H',
    mSize: 0.05,
    size: 250,
}

function createQrEle(classIndex) {
    var qrEle = document.createElement('div');
    qrEle.className = 'qrCode' + classIndex + " qrCode";
    $('#result').append(qrEle);
}

function renderQr(selector, ops) {
    $(selector).qrcode(ops);
}


function handleFileSelect(evt) {
    console.log(evt);
    $('#result').html('');
    var reader = new FileReader();
    reader.readAsBinaryString(evt.target.files[0]);
    reader.onload = function(e) {
        var wb = XLS.read(e.target.result, {
            type: 'binary'
        });
        // revert to qrcode obj info
        var columnLength = wb.Sheets.Sheet1['!range'].e.c;
        var allExcelData = wb.Sheets.Sheet1;

        var temp = [],
            i = 0,
            result = [],
            tempObj = {};
        var tempJ = 0;
        for (data in allExcelData) {
            if (i < columnLength) {
                temp.push(allExcelData[data].v);
                i++;
                continue;
            }
            tempObj[temp[tempJ++]] = allExcelData[data].v;
            if (tempJ >= columnLength) {
                result.push(tempObj);
                tempObj = {};
                tempJ = 0;
            }
        }
        // console.log(result);
        renderQrList(result);
    }
}

function renderQrList(qrl) {
    $('.progressbar').show();
    $('.btn-print').hide();
    $('.btn-file').attr('disabled','disabled')
    $.each(qrl, function(index, value) {
        setTimeout(function() {
            renderProgressbar(index+1);
            createQrEle(index);
            renderQr(".qrCode" + index, $.extend(qrDefalut, value));
        }, 0)
    })

    function renderProgressbar(curIndex) {
        // console.log(Math.floor((curIndex / qrlLength)*100 ) +'%');
        var progressbarLabel = $(".progress-label");
        var pgValue = Math.floor((curIndex / qrl.length) * 100)+1;
        $('.progressbar').progressbar({
            value: pgValue,
            change: function() {
                progressbarLabel.text('已完成：' + pgValue + '%');
            },
            complete: function() {
                progressbarLabel.text('二维码生成完成！')
                $('.btn-print').show();
                $('.btn-file').removeAttr("disabled");
            }
        })
    }
}

function printHandler() {
    $(".intro").hide();
    print();
    $(".intro").show();
}

function init() {
    $('.qrListInput').on('change',handleFileSelect);
}

init();
