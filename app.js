const applicationKey = 'b6fda97a7500a9c0f869e09b24b97b0540bd41b7e4d2ac6141b561e9ec690ee6';
const clientKey = '955d38eca37fd2906a752d6edde4e49481f3c507327efaef030256c592548202';
const ncmb = new NCMB(applicationKey, clientKey);
const hide = (query) => {
  eleChange(query, 'none');
}

const display = (query) => {
  eleChange(query, 'block');
}
const eleChange = (query, style) => {
  document.querySelectorAll(query).forEach(e => e.style.display = style);
}

document.addEventListener('DOMContentLoaded', e => {
  hide('.hide');
  hide('.attendUrl');
  document.querySelector('#submit1').onclick = async e => {
    e.preventDefault();
    display('.spinner1');
    hide('.ptype');
    const url = document.querySelector('#url').value;
    const key = document.querySelector('#key').value;
    await ncmb.Script
      .query({ url, key})
      .exec('GET', 'connpass.rb')
    await ncmb.Script
      .exec('GET', 'login.rb')
    await ncmb.Script
      .query({ url })
      .exec('GET', 'participate.rb');
    const longUrl = `https://mbaas.api.nifcloud.com/2013-09-01/applications/8JSajPkL3qriAK9A/publicFiles/checkin.html?key=${key.toLowerCase()}`;
    const response = await ncmb.Script
      .query({ url: longUrl })
      .exec('GET', 'bitly.rb');
    document.querySelector('.bitlyUrl').value = JSON.parse(response.body).data.url;
    const pTypes = await ncmb.DataStore(`${key}_Type`).fetchAll();
    const html = pTypes.map(type => {
      return `<tr>
          <td>${type.get('name')}</td>
          <td>
            <input type="text" data-id="${type.get('objectId')}" class="form-control ptypeUrl" placeholder="https://example.com/" value="${type.get('video_url') || ''}" />
          </td>
          <td class="${type.get('objectId')}">
            <div class="spinner-border hide" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </td>
        </tr>`;
    });
    document.querySelector('.ptype table tbody').innerHTML = html.join('');
    hide('.hide');
    display('.attendUrl');
    display('.ptype');
    hide('.spinner1');
  }

  document.querySelector('#submit2').onclick = async e => {
    e.preventDefault();
    const key = document.querySelector('#key').value;
    const Type = ncmb.DataStore(`${key}_Type`);
      document.querySelectorAll('.ptypeUrl').forEach(async ele => {
      display(`.${ele.dataset.id} .spinner-border`);
      const type = new Type;
      await type
        .set('objectId', ele.dataset.id)
        .set('video_url', ele.value)
        .update();
      document.querySelector(`.${ele.dataset.id}`).innerHTML = '✔️';
    });
  }
})