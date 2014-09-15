		function createQrEle(classIndex){
			var qrEle=document.createElement('div');
			qrEle.className='qrCode'+classIndex+" qrCode";
			$('#result').append(qrEle);
		}
		function renderQr(selector,ops){
			$(selector).qrcode(ops);
		}


		function handleFileSelect(evt){
			console.log(evt);
			var reader=new FileReader();
			reader.readAsBinaryString(evt.target.files[0]);
			reader.onload=function(e){
				var wb = XLS.read(e.target.result,{type:'binary'});
				// revert to qrcode obj info
				var columnLength=wb.Sheets.Sheet1['!range'].e.c;
				var allExcelData=wb.Sheets.Sheet1;

				var temp=[],i=0,result=[],tempObj={};
				var tempJ=0;
				for(data in allExcelData){
					if(i<columnLength){
						temp.push(allExcelData[data].v);
						i++;
						continue;
					}
					tempObj[temp[tempJ++]]=allExcelData[data].v;
					if(tempJ>=columnLength){
						result.push(tempObj);
						tempObj={};
						tempJ=0;
					}
				}
				// console.log(result);
				renderQrList(result);
			}
		}
		var qrDefalut={
			render:'image',
			mode:2,
			ecLevel:'H',
			mSize:0.05,
			size:250,
			}
		function renderQrList(qrl){
			$.each(qrl,function(index,value){
				setTimeout(function(){
					createQrEle(index);
					renderQr(".qrCode"+index,$.extend(qrDefalut,value));
				},0)
			})
		}
		function init(){
			document.getElementById('qrListInput').addEventListener('change',handleFileSelect,false);
		}

		init();