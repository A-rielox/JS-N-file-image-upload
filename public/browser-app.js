const url = '/api/v1/products';
const fileFormDOM = document.querySelector('.file-form');

const nameInputDOM = document.querySelector('#name');
const priceInputDOM = document.querySelector('#price');
const imageInputDOM = document.querySelector('#image');

const containerDOM = document.querySelector('.container');
let imageValue;

// imageInputDOM.addEventListener('change',(e)=>{
//  const file = e.target.files[0];
//  console.log(file);
// })

// este post lo sube al server ( a mi carpeta public/uploads ) con el controller uploadProductImage
// x lo q veo, x el 'Content-Type': 'multipart/form-data', lo q está en "formData", que es mi "imagen", no se mete en el "req.body", sino en "req.file", gracias al header q se pone
//  the multipart/form-data type allows you to send files through an HTTP POST request.
imageInputDOM.addEventListener('change', async e => {
   const imageFile = e.target.files[0];
   const formData = new FormData();
   formData.append('image', imageFile);

   try {
      const {
         data: {
            image: { src },
         },
      } = await axios.post(`${url}/uploads`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
      // imageValue es el src a donde se almacena en el server
      imageValue = src;
   } catch (error) {
      imageValue = null;
      console.log(error);
   }
});

fileFormDOM.addEventListener('submit', async e => {
   e.preventDefault();
   const nameValue = nameInputDOM.value;
   const priceValue = priceInputDOM.value;

   try {
      const product = { name: nameValue, price: priceValue, image: imageValue };

      // manda el src del archivo en mi server a la DB
      await axios.post(url, product);
      fetchProducts();
   } catch (error) {
      console.log(error);
   }
});

async function fetchProducts() {
   // el get manda un "Product.find({})" la DB, lo q tiene el "product.image" es solo el path al archivo en mi server, q va a ser la carpeta "/public/uploads/el-archivo", y la renderizada del front agarra de aqui la imagen
   try {
      const {
         data: { products },
      } = await axios.get(url);

      const productsDOM = products
         .map(product => {
            return `
            <article class="product">
               <img src="${product.image}" alt="${product.name}" class="img"/>
               <footer>
                  <p>${product.name}</p>
                  <span>$${product.price}</span>
               </footer>
            </article>`;
         })
         .join('');
      containerDOM.innerHTML = productsDOM;
   } catch (error) {
      console.log(error);
   }
}

fetchProducts();
