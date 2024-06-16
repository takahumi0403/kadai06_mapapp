// 変数の宣言
let map,searchManager,loc,i=0;
// マップの表示。＃myMapに表示。東京駅を中心に。
function GetMap(){
    map = new Microsoft.Maps.Map('#myMap',{
      center:new Microsoft.Maps.Location(35.68192219074267,139.76779507858535),
      zoom:15
    });

    // マップの中心を逆ジオコーテイング
    loc = map.getCenter();
    reverseGeocode();

    // マップのクリックイベントの追加
    Microsoft.Maps.Events.addHandler(map,'click',function(e){
    loc = e.location;
    reverseGeocode();
    });
}

function reverseGeocode(){
    // searchManagerが未定義な場合、再度Serchモジュールをリロードして再度reverseGeocodeを呼び出す。
    if(!searchManager){
        Microsoft.Maps.loadModule('Microsoft.Maps.Search',function(){
        searchManager = new Microsoft.Maps.Search.SearchManager(map);
        reverseGeocode()
        });
    }else{
      const searchRequest= {
         location :loc,
           callback :function(r){
            // Pushpinの作成.Pushpinのタイトル、テキスト番号
            let pin = new Microsoft.Maps.Pushpin(loc,{
                title:r.name,
                text:`${++i}`
            });
            // PushPinの追加
            map.entities.push(pin);

            //逆ジオコーディングの結果をHTMLに表示
            const div = document.createElement("div");
            div.innerText = `(${i}) ${r.name} ${loc}`;
            document.querySelector("#address").insertBefore(div,document.querySelector("#address").firstElementChild);
          },
           errorCallback:function(e){
            alert("Unable to reverse geocode location.");
          }
        }
          searchManager.reverseGeocode(searchRequest);
    }

};

// 保存したとき
$('#save').on("click",function(){
  const lat = loc.latitude;
  const lon = loc.longitude;
  const daytime = $("#time").val(); 
  const TT = $("#title").val();
  const TX = $("#text").val();
  localStorage.setItem(lat,lon);
  const html =`
  <li>
  <p>${loc}</p>
  <p>${daytime}</p>
  <p>${TT}</p>
  <p>${TX}</p>
  </li>`
  ;
  $("#list").append(html);
  alert(loc);

});