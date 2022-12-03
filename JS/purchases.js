purchasesnumber = 0;
number = 0;

function getNum(){
  purchasesnumber = localStorage.getItem(0);
  number = 0;

  for (let i = 1; i <= purchasesnumber; i++){
    let a = JSON.parse(localStorage.getItem(i));
    if (a == null || a == undefined)
      continue;

    number += a.count;
  }

  document.getElementById("purchasesnumber").innerHTML='<p id="purchasesnumber">' + (number ?? 0) +'</p>';
}

function addpurchases(newname) {
    let oldcount = 0;
    let title = document.getElementsByTagName("title")[0].innerHTML;
    let i = 1;
    let firstDeletedElemIndex = -1;
    for (; i <= purchasesnumber; i++){
      if ((localStorage.getItem(i) == null || localStorage.getItem(i) == undefined) && firstDeletedElemIndex == -1 )
        firstDeletedElemIndex = i;
      else {
        let a = JSON.parse(localStorage.getItem(i));
        if (a.name == title){
          oldcount = a.count;
          localStorage.removeItem(i);
          break;
        }
      }
    }
    if (firstDeletedElemIndex != -1){
      i = firstDeletedElemIndex;
    }

    img = ($('.small img').attr('src') ?? $('.big img').attr('src'));
    price = $('.price').html();

    sale = $('.sale').html() ?? -1;
    let a = {
      'name': title,
      'count': oldcount + 1,
      'img': img.replace('../../',''),
      'price': price,
      'sale': sale
    };

    localStorage.setItem(i, JSON.stringify(a));
    if (Number(i) == Number(Number(purchasesnumber) + 1)){
      purchasesnumber++;
      localStorage.removeItem(0);
      localStorage.setItem(0, purchasesnumber);
    }
    number++;
    let pc = document.getElementById("purchasesnumber");
    pc.innerHTML='<p id="purchasesnumber">' + number +'</p>';
  }


function MakeBasket() {
  getNum();
  totalCost = 0;
  basketlist = document.querySelector('#basketlist');
  for (let i = 1; i <= purchasesnumber; i++){
      let object = JSON.parse(localStorage.getItem(i));
      if (object == null || object == undefined)
        continue;

      totalCost += Number(object.price.replace('РУБ','')) * object.count;

      basketlist.insertAdjacentHTML('beforeend', '<div class="basketElem"><h3>' + object.name + '</h3><div class="deleteelem"><span><i class="fa fa-times" aria-hidden="true" onclick="deleteFromBasket(' + i + ');"></i></span></div><img src="'+ object.img +'" alt="Товар"><div class="buyinfo"><div class="minus"><i class="fa fa-minus" aria-hidden="true" onclick="DecreaseElem(this, ' + i + ');" alt="' + object.name +'"></i></div><div class="itemcount">  <div class="count"><p>' + object.count + '</p></div></div><div class="plus"><i class="fa fa-plus" aria-hidden="true" onclick="IncreaseElem(this, ' + i + ');" alt="' + object.name +'"></i></div></div><div class="priceblock info"><p class="price">' + object.price + '</p>' + (object.sale != "-1" ? '<p class="sale">' + object.sale + '</p>':'')+'</div><br></div>');
  }

  if (totalCost != "0")
    basketlist.insertAdjacentHTML('beforeend', '<div id="totalCost">' + totalCost + ' РУБ</div>');
  else
    basketlist.insertAdjacentHTML('beforeend','<div id="totalCost">В корзине пока что нет товаров...</div> ');
}

function DecreaseElem(elem, index){
  name = elem.getAttribute('alt');
  for (let i = 1; i <= purchasesnumber; i++){
    if (localStorage.getItem(i) == null || localStorage.getItem(i) == undefined)
      continue;

    let a = JSON.parse(localStorage.getItem(i));
    if (a.name == name){

      if (Number(a.count) == 1)
        return;

      let b = {
        'name': a.name,
        'count': a.count - 1,
        'img': a.img,
        'price': a.price,
        'sale': a.sale
      };
      localStorage.removeItem(i);
      localStorage.setItem(i, JSON.stringify(b));

      document.querySelectorAll(".count")[index-1].innerHTML = ('<p>' + b.count +'</p>');
      number--;
      document.getElementById("purchasesnumber").innerHTML='<p id="purchasesnumber">' + number +'</p>';
      let costAdjustment = -1 * (Number(a.price.replace('РУБ','')));
      TotalCostUpdater(costAdjustment);
      break;
    }
  }
}
function IncreaseElem(elem, index) {
  name = elem.getAttribute('alt');
  for (let i = 1; i <= purchasesnumber; i++){
    if (localStorage.getItem(i) == null || localStorage.getItem(i) == undefined)
      continue;

    let a = JSON.parse(localStorage.getItem(i));
    if (a.name == name){
      let b = {
        'name': a.name,
        'count': a.count + 1,
        'img': a.img,
        'price': a.price,
        'sale': a.sale
      };
      localStorage.removeItem(i);
      localStorage.setItem(i, JSON.stringify(b));
      document.querySelectorAll(".count")[index - 1].innerHTML = ('<p>' + b.count +'</p>');
      number++;
      let pc = document.getElementById("purchasesnumber");
      pc.innerHTML='<p id="purchasesnumber">' + number +'</p>';
      let costAdjustment = Number(a.price.replace('РУБ',''));
      TotalCostUpdater(costAdjustment);
      break;
    }
  }
}

function deleteFromBasket(index) {
  if (!confirm("Вы уверены, что хотите удалить товар из корзины ?"))
    return;

  let price = document.querySelectorAll(".basketElem .price")[index - 1];
  let count = document.querySelectorAll(".basketElem .count p")[index - 1];
  let costAdjustment = (price.innerHTML.replace("РУБ",'')) * count.innerHTML;
  TotalCostUpdater(-1 * costAdjustment);

  let elem = document.querySelectorAll(".basketElem")[index - 1];
  elem.parentNode.removeChild(elem);

  localStorage.removeItem(index);

  for (let i = index + 1; i <= purchasesnumber; i++) {
    let a = JSON.parse(localStorage.getItem(i));
    localStorage.removeItem(i);
    localStorage.setItem(i-1, JSON.stringify(a))
  }
  purchasesnumber--;
  localStorage.removeItem(0);
  localStorage.setItem(0, purchasesnumber);

  getNum();
  for (let i = 0; i < document.querySelectorAll(".fa-times").length; i++){
    document.querySelectorAll(".fa-times")[i].setAttribute('onclick', 'deleteFromBasket(' + (Number(i) + 1) +');');
    document.querySelectorAll(".fa-minus")[i].setAttribute('onclick', 'DecreaseElem(this, ' + (Number(i) + 1) + ');');
    document.querySelectorAll(".fa-plus")[i].setAttribute('onclick', 'IncreaseElem(this, ' + (Number(i) + 1) + ');');
  }
}
function TotalCostUpdater(totalCost){
  let cost = document.getElementById("totalCost").innerHTML.replace('РУБ', '');
  let newTotalCost = (Number(cost) + totalCost);
  if (newTotalCost != "0")
    document.getElementById("totalCost").innerHTML = (Number(cost) + totalCost) + " РУБ";
  else
    document.getElementById("totalCost").innerHTML = "В корзине пока что нет товаров...";
}
