console.log(follow);
let cards = document.getElementById('cards');

let names = [];
for (var i = 0; i < follow.length; i++) {
    names.push(follow[i].name);
}
console.log(names);

for (var i = 0; i < follow.length; i++) {
    let card = create_card(follow[i], i);
    cards.appendChild(card);
}

function create_card(infos, i) {
    let card = document.createElement('div');
    let ic_name_ig = document.createElement('div');
    let ranks = document.createElement('div');
    let ic = document.createElement('div');
    let name = document.createElement('a');
    let ig = document.createElement('div');
    let in_game = document.createElement('img');
    let ic_img = document.createElement('img');
    let sq = document.createElement('div');
    let flex = document.createElement('div');
    let tft = document.createElement('div');
    let sq_title = document.createElement('p');
    let flex_title = document.createElement('p');
    let tft_title = document.createElement('p');
    let sq_img = document.createElement('img');
    let flex_img = document.createElement('img');
    let tft_img = document.createElement('img');
    let sq_text = document.createElement('p');
    let flex_text = document.createElement('p');
    let tft_text = document.createElement('p');

    card.className = 'col-md-3 card mx-5';
    card.style.borderRadius = '10px';
    card.style.marginTop = '20px';
    card.borderColor = 'rgba(44,4d,55,1)';
    card.style.backgroundColor = 'rgba(33,37,41, 1)';
    ic_name_ig.className = 'row';
    ranks.className = 'row';
    ic.className = 'col-md-4';
    ic_img.className = 'img-fluid';
    name.className = 'col-md-6';
    ig.className = 'col-md-2';
    in_game.className = 'img-fluid';
    sq.className = 'col-md-4';
    flex.className = 'col-md-4';
    tft.className = 'col-md-4';
    sq_title.className = 'text-center my-1';
    flex_title.className = 'text-center my-1';
    tft_title.className = 'text-center my-1';
    sq_img.className = 'img-fluid';
    flex_img.className = 'img-fluid';
    tft_img.className = 'img-fluid';
    sq_text.className = 'text-center';
    flex_text.className = 'text-center';
    tft_text.className = 'text-center';

    ic_img.src = 'images/riot/profileicon/' + infos.icon + ".png";
    ic_img.style.width = '50px';
    ic_img.style.height = '50px';
    ic_img.style.borderRadius = '50%';
    ic_img.style.margin = 'auto';
    ic_img.style.display = 'block';
    name.textContent = infos.name;
    name.href = infos.url;
    name.style.color = 'white';
    name.style.textDecoration = 'none';
    name.style.marginTop = 'auto';
    name.style.marginBottom = 'auto';
    name.style.fontSize = '20px';
    sq_img.src = 'images/riot/ranks/' + infos.ranks.sq.rank.toLowerCase().charAt(0).toUpperCase() + infos.ranks.sq.rank.slice(1).toLowerCase() + '.png';
    flex_img.src = 'images/riot/ranks/' + infos.ranks.flex.rank.toLowerCase().charAt(0).toUpperCase() + infos.ranks.flex.rank.slice(1).toLowerCase() + '.png';
    tft_img.src = 'images/riot/ranks/Unranked.png';
    sq_text.textContent = infos.ranks.sq.rank != "UNRANKED" ? infos.ranks.sq.division +" " + infos.ranks.sq.lp + ' LP' : 'Unranked';
    flex_text.textContent = infos.ranks.flex.rank != "UNRANKED" ?  infos.ranks.flex.division + " " + infos.ranks.flex.lp +' LP': 'Unranked';
    tft_text.textContent = "Unranked ";
    if (infos.in_game) {
        if (infos.game.ally.length > 5)
        {
            ig.textContent = "TFT";
            ig.style.color = "white";
            ig.fontSize = "7px";
        }
        in_game.src = 'images/riot/on.png';
    }
    else {
        in_game.src = 'images/riot/off.png';
    }

    ic_name_ig.style.backgroundColor = 'rgba(33,37,41, 1)';
    ranks.style.backgroundColor = 'rgba(33,37,41, 0.6)';
    sq_title.textContent = 'Solo/Duo';
    flex_title.textContent = 'Flex';
    tft_title.textContent = 'TFT';
    sq_title.style.color = 'white';
    flex_title.style.color = 'white';
    tft_title.style.color = 'white';

    sq_text.style.color = 'white';
    flex_text.style.color = 'white';
    tft_text.style.color = 'white';
    ic.appendChild(ic_img);
    ig.appendChild(in_game);
    sq.appendChild(sq_title);
    sq.appendChild(sq_img);
    sq.appendChild(sq_text);
    flex.appendChild(flex_title);
    flex.appendChild(flex_img);
    flex.appendChild(flex_text);
    tft.appendChild(tft_title);
    tft.appendChild(tft_img);
    tft.appendChild(tft_text);
    ranks.appendChild(sq);
    ranks.appendChild(flex);
    ranks.appendChild(tft);
    ic_name_ig.appendChild(ic);
    ic_name_ig.appendChild(name);
    ic_name_ig.appendChild(ig);
    card.appendChild(ic_name_ig);
    card.appendChild(ranks);
    return card;
}