let items;
// API 가져오기
$.ajax({
    type: "get",
    url: "http://ddragon.leagueoflegends.com/cdn/13.24.1/data/ko_KR/item.json",
    success: function(data) {
        var allItems = Object.values(data.data);
        items = allItems;

        items.sort(function(a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        var filterItems = items.filter(function(items) {
            return (
                !items.requiredChampion && // 챔피언 전용 템 제외
                items.description.includes("rarityMythic") && // 신화급 아이템만 출력
                items.inStore !== false && // 스토어: false인 item 제외
                items.maps["11"] === true // 소환사의 협곡 맵("11")만 출력
            );
        });

        // 아이템 출력 기능 구현
        function printItems(filterItems, containerId) {
            var container = $("#" + containerId);
            container.empty(); // 해당 컨테이너 내부 초기화
            for (var i = 0; i < filterItems.length; i++) {
                var item = filterItems[i];
                var imgURL =
                    "http://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/" +
                    item.image.full;
                var itemButton = $("<button type='button' class='item_box'><img src='" + imgURL + "' alt='" + item.name + "'></button>" + item.name);

                // 아이템 이미지 버튼에 클릭 이벤트를 설정
                setItemClickEvent(itemButton, item, containerId);

                container.append(itemButton);
            }
        }
        // 각 아이템 박스마다 선택된 신화 아이템을 저장하는 배열
        var selectedMythicItem = [null, null, null, null, null, null];


        // 아이템 이미지 버튼을 클릭하면, 선택한 아이템 박스에 이미지를 설정
        function setItemClickEvent(itemButton, item, containerId) {
            itemButton.click(function() {
                var imgSrc = $(this).find("img").attr("src");
                var iBoxIndex = containerId.replace("itemContainer", "");
                var iBox = $("#iBox" + iBoxIndex);
                var itemBox = $(".dropdown-menu");




                // 이미 신화 아이템이 선택된 상태라면 팝업을 띄우고 함수 종료
                if (selectedMythicItem.some((selectedItem, index) =>
                    selectedItem !== null && index !== iBoxIndex)) {
                    alert("신화 아이템은 하나만 선택 가능합니다.");
                    return;
                }

                // 이미지와 X버튼을 생성
                iBox.html(
                    "<img src='" +
                    imgSrc +
                    "'><button class='itemRemoveBtn'>X</button>"
                );
                itemBox.remove(); // 아이템을 선택하면 #itemContainer 제거

                // X버튼 클릭 이벤트
                iBox.find(".itemRemoveBtn").click(function() {
                        iBox.empty();
                        selectedMythicItem[iBoxIndex] = null;
                        $(".cost p").text(": 0원");// 아이템 가격 초기화
                    });

                selectedMythicItem[iBoxIndex] = item; // 신화 아이템 선택 상태 업데이트
                var itemPrice = item.gold.total;
                $(".cost p").text(": " + itemPrice + " 원");
            });


            itemButton.mouseover(function() {
                var imgSrc = $(this).find("img").attr("src");
                var imgName = imgSrc.split("/").pop();

                if (imgName === item.image.full) {
                    var description = item.description;

                    description = description.replace(/(<([^>]+)>)/gi, "");
                    description = description.replace(/\r?\n|\r/g, "");

                    $("#" + containerId).append("<p>" + description + "</p>");
                }
            });

            itemButton.mouseout(function() {
                $("#" + containerId + " p").remove();
            });
        }

        for (var i = 1; i <= 6; i++) {
            (function(i) {
                var containerId = "itemContainer" + i;
                var searchBar = "left-item-search" + i;
                var container = $("#" + containerId);

                $("#iBox" + i).click(function() {
                    if (container.children().length === 0) {
                        printItems(filterItems, containerId);
                    }
                    container.show();
                });

                container.on("click", ".item_box", function() {
                    var imgSrc = $(this).find("img").attr("src");
                    var iBoxIndex = containerId.replace("itemContainer", "");
                    var iBox = $("#iBox" + iBoxIndex);

                    iBox.html(
                        "<img src='" +
                        imgSrc +
                        "'><button class='itemRemoveBtn'>X</button>"
                    );

                    iBox.find(".itemRemoveBtn")
                        .click(function() {
                            iBox.empty();
                            selectedMythicItem[iBoxIndex] = null;
                            $(".cost p").text(": 0원");
                        });

                    var selectedItemIndex = $(this).index();
                    var selectedItem = filterItems[selectedItemIndex];
                    selectedMythicItem[iBoxIndex] = selectedItem;
                    var itemPrice = selectedItem.gold.total;
                    $(".cost p").text(": " + itemPrice + " 원");
                });
            })(i);
        }
    }
});
$(document).mouseup(function(e){
    var container = $("#itemContainer");

    //newBox와 item_pan를 제외한 부분을 클릭 했을 경우 newBox닫기
    if(!container.is(e.target)&&container.has(e.target).length===0&&!$(".item_pan").is(e.target)&&$(".item_pan").has(e.target).length===0){
        container.remove();
    }
});


// let items;
// // API 가져오기
// $.ajax({
//     type:"get",
//     url:"http://ddragon.leagueoflegends.com/cdn/13.24.1/data/ko_KR/item.json",
//     success:function(data){
//         var allItems=Object.values(data.data);//챔피언 데이터 배열 추출
//         items = allItems;
//
//         //=======================아이템 가나다 순 정렬
//         items.sort(function(a,b){
//             var nameA=a.name.toUpperCase();
//             var nameB=b.name.toUpperCase();
//
//             if(nameA<nameB){
//                 return -1;
//             }
//             if(nameA>nameB){
//                 return 1;
//             }
//             return 0;
//         });
//         /*===========================정렬end==========================*/
//
//         var filterItems=items.filter(function(items){
//             return !items.requiredChampion // 챔피언전용템제외
//                 && items.description.includes('rarityMythic') // 신화급 아이템만 출력
//                 && items.inStore!==false // 스토어: false인 item 제외
//                 && items.maps["11"]===true; // 소환사의 협곡 맵("11")만 출력
//         });
//
//         /* 아이템 출력 기능 구현 */
//         var clickItemBox;
//         function printItems(filterItems){
//             $("#newBox").empty();//newBox의초기값공백
//             for(var i=0;i<filterItems.length;i++){
//                 var item=filterItems[i];
//                 var imgURL="http://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/"+item.image.full;
//                 var itemButton=$("<button type='button' class='item_box'><img src='"+imgURL+"'alt='"+item.name+"'></button>"+item.name)
//
//                 //아이템 이미지 버튼에 클릭 이벤트를 설정
//                 setItemClickEvent(itemButton,item,clickItemBox.attr('id').replace('iBox','')-1);
//
//                 $("#newBox").append(itemButton);
//             }
//         }
//         //각 아이템 박스마다 선택된 신화 아이템을 저장하는 배열
//         var selectedMythicItem=[null,null,null,null,null,null]
//
//         // 아이템 이미지 버튼을 클릭하면,선택한 아이템 박스에 이미지를 설정하고,다시 클릭하면초기화
//         function setItemClickEvent(itemButton,item,iBoxIndex){
//             itemButton.click(function(){//마우스클릭시이벤트
//                 var imgSrc= $(this).find('img').attr('src');
//
//                 // 이미 신화 아이템이 선택된 상태라면 팝업을 띄우고 함수 종료
//                 if(selectedMythicItem.some((selectedMythicItem,index)=>
//                     selectedMythicItem!==null&&index!==iBoxIndex)){
//                     alert("신화 아이템은 하나만 선택 가능 합니다.");
//                     return;
//                 }
//
//                 // 이미지와 X버튼을 생성
//                 clickItemBox.html("<img src='"+imgSrc+"'><button class='itemRemoveBtn'>X</button>");
//                 $("#itemContainer").append("<div id='newBox'></div>"); // itemContainer에 newBox 추가
//                 // $("#newBox").remove();//아이템을 선택하면 #newBox제거
//
//                 // X버튼 클릭 이벤트
//                 clickItemBox.find('.itemRemoveBtn').click(function(){
//                     $(this).siblings('img').remove(); // 현재 'X' 버튼과 동일한 iBox의 이미지만 제거
//                     $(this).remove(); // 'X' 버튼 제거
//                     selectedMythicItem[iBoxIndex] = null;
//                     $(".cost p").text(":0원"); // 아이템 가격 초기화
//                 });
//
//                 selectedMythicItem[iBoxIndex] = item;//신화 아이템 선택 상태 업데이트
//                 var itemPrice= item.gold.total; // 아이템의 total값을 추출
//                 $(".cost p").text(": "+itemPrice+" 원");//아이템 가격을 HTML에 적용
//             });
//
//             itemButton.mouseover(function(){//마우스 올리면 이벤트
//                 var imgSrc=$(this).find('img').attr('src');
//                 var imgName=imgSrc.split('/').pop();//이미지 파일 이름 추출
//                 // 마우스를 올린 이미지와 API에서 가져 온 아이템의 이미지가 일치하는지 확인
//                 if(imgName===item.image.full){
//                     var description=item.description;
//                     // HTML 태그 제거
//                     description=description.replace(/(<([^>]+)>)/ig,"");
//                     // 필요 없는 문자 제거
//                     description=description.replace(/\r?\n|\r/g,"");
//                     // 모든 description 출력
//                     $("#newBox").append('<p>'+description+'</p>');
//                 }
//             });
//             itemButton.mouseout(function(){//마우스내리면이벤트
//                 $("#newBox p").remove();
//             });
//         }
//
//         //6개의 각각의 박스에서 원하는 버튼에 클릭할 경우 기능
//         for (var i = 1; i <= 6; i++) {
//             $("#iBox" + i).click(function() {
//                 var containerId = "itemContainer" + i;
//                 if ($("#" + containerId).children().length === 0) {
//                     $("#" + containerId).append('<div id="newBox"></div>');
//                 } else if (clickItemBox && clickItemBox[0] === this) {
//                     $("#newBox").remove();
//                     return;
//                 }
//                 clickItemBox=$(this);//현재 클릭한 아이템 박스를 저장
//                 printItems(filterItems);//아이템 출력을 새로운 박스 안으로 변경
//             });
//         }
//     }
// });
// $(document).mouseup(function(e){
//     var container=$("#newBox");
//
//     //newBox와 item_pan를 제외한 부분을 클릭 했을 경우 newBox닫기
//     if(!container.is(e.target)&&container.has(e.target).length===0&&!$(".item_pan").is(e.target)&&$(".item_pan").has(e.target).length===0){
//         container.remove();
//     }
// });


