let cart = [];
let modalQt = 1;
let modalKey;
let actualPrice = 0;
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//LISTAGEM DAS PIZZAS
pizzaJson.map((item, index) => {
    pizzaItem = c('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    actualPrice = item.prices[2].toFixed(2);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${actualPrice}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //ABRIR O MODAL
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault();
        modalQt = 1;
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].prices[2].toFixed(2)}`;
        //Deselecionar todos os itens P M G
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            //Selecionando o item G
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.opacity = 0;//mostra com total transparência
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;//mostra com zero transparência
        }, 200);
    });
    //ADICIONA AS PIZZAS NA DIV 'pizza-area'
    c('.pizza-area').append(pizzaItem);
});

//EVENTOS DOS MODAL
//FECHAR MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    });
}
// Botão de fechar no modo mobyle e cancelar no modo desktop
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//EVENTOS BOTÕES DE QUATIDADES '-' E '+' DO MODAL
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${(actualPrice * modalQt).toFixed(2)}`;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${(actualPrice * modalQt).toFixed(2)}`;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//EVENTOS DO P M G
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        // e.target para selecionar o próprio ítem que esta clicando, mas quebrou quando clicado no span, então usei o próprio size
        //e.target.classList.add('selected');
        size.classList.add('selected');
        actualPrice = pizzaJson[modalKey].prices[sizeIndex].toFixed(2);
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${actualPrice}`;

    });
});

//ADICIONAR AO CARRINHO DE COMPRAS
c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //MONTANDO O CARRINHO
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    console.log(cart);
    updateCart();
    closeModal();
});

//ATUALIZA O CARRINHO E, CASO TENHA ALGUM ÍTEM SELECIONADO, ABRE O SIDE LATERAL DA COMPRA
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0) {
        let subTotal = 0;
        c('aside').classList.add('show');
        //Zerar para quando acrescentar outro item no carrinho não repetir os anteriores
        c('.cart').innerHTML = "";
        for (let i in cart) {
            let pizzaItem = pizzaJson.find((pizza) => pizza.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);
            let sizeInfo = 'G';
            if (cart[i].size == 0)
                sizeInfo = "P";
            if (cart[i].size == 1)
                sizeInfo = "M";
            let pizzaInfo = `${pizzaItem.name} (${sizeInfo}) - R$ ${pizzaItem.prices[cart[i].size].toFixed(2)}`
            subTotal += pizzaItem.prices[cart[i].size] * cart[i].qt;
            cartItem.querySelector('.cart--item img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaInfo}`;
            cartItem.querySelector('.cart--item--qt ').innerHTML = cart[i].qt;
            //AÇÔES DOS BOTÕES DO CARRINHO '+' E '-'
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            //ADICIONA O CARRINHO NA DIV 'cart' DO ASIDE
            c('.cart').append(cartItem);
        }
        c('.subtotal span:nth-child(2)').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        c('.desconto span:nth-child(2)').innerHTML = `R$ ${(subTotal * 0.1).toFixed(2)}`;
        c('.total span:nth-child(2)').innerHTML = `R$ ${(subTotal - (subTotal * 0.1)).toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

//EVENTO DE CLICAR NO CARRINHO DO MOBILE
c('.menu-openner span').addEventListener('click',() =>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click',()=>c('aside').style.left = '100vw');