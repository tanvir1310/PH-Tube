console.log('hi')
//1- fetch, load and show catagories on html
//create load catagories
function gettimeString(time) {

  const hour = parseInt(time/3600);
  let remainingSecond = time % 3600;
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;

  return `${hour} hour ${minute} minute ${remainingSecond} second ago`;
}

const removeActiveClass = () => {
const buttons = document.getElementsByClassName('category-btn');
for (let btn of buttons){
  btn.classList.remove('active');
}

}

const loadCatagories = () => {
  console.log('hello load')
  fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
  .then(res => res.json())
  .then((data) => displayCatagories(data.categories))
  .catch(error => console.log(error))

};
//create load vedios
const loadVideos = (searchText = "") => {
  console.log('hello load')
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
  .then(res => res.json())
  .then((data) => displayVideos(data.videos))
  .catch(error => console.log(error))

};


const loadCategoryVideos = (id) => {
  // alert(id);
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
  .then(res => res.json())
  .then((data) => {
    removeActiveClass ();
    const activeBtn = document.getElementById(`btn-${id}`);
    // console.log(activeBtn);
    activeBtn.classList.add("active");
    displayVideos(data.category);
  })
  .catch(error => console.log(error))
}

const loadDetails = async (videoId) => {
const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
const res = await fetch(uri);
const data = await res.json();
displayDetails(data.video);
};

const displayDetails = (video) => {
const detailsContainer = document.getElementById('modal-content');
detailsContainer.innerHTML = `
<img src = ${video.thumbnail} />
<p>${video.description}</p>
`

//way-1
document.getElementById('showModalData').click();
//way-2
document.getElementById('customModal').showModal();
}

// const cardDemo = {
//   "category_id": "1001",
//   "video_id": "aaaa",
//   "thumbnail": "https://i.ibb.co/L1b6xSq/shape.jpg",
//   "title": "Shape of You",
//   "authors": [
//       {
//           "profile_picture": "https://i.ibb.co/D9wWRM6/olivia.jpg",
//           "profile_name": "Olivia Mitchell",
//           "verified": ""
//       }
//   ],
//   "others": {
//       "views": "100K",
//       "posted_date": "16278"
//   },
//   "description": "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey."
// }



const displayVideos = (videos) => {
  // console.log(videos);
  const videoContainer = document.getElementById('videos');

  videoContainer.innerHTML = '';

  if(videos.length == 0){
    videoContainer.classList.remove('grid');
    videoContainer.innerHTML = `
    <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
    <img src="assets/Icon.png" />
    <h2 class="text-2xl font-bold text-gray-600">No videos found</h2>
    </div>
    `;
    return;
  }
  else{
    videoContainer.classList.add('grid');
  }

  videos.forEach( video => {
    const card = document.createElement('div');
    card.classList = 'card card-compact'
    card.innerHTML = 
    `
        <figure class="h-[280px] relative">
              <img
                src= ${video.thumbnail}
                class="h-full w-full object-cover"
                alt="Shoes" />
                ${
                  video.others.posted_date?.length == 0 ? "" : `
                  <span class="absolute text-xs right-2 bottom-2 bg-black text-white rounded p-1">${gettimeString(video.others.posted_date)}</span>
                  `
                }
                
      </figure>
      <div class="px-0 py-2 flex gap-2">
        <div>
            <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture}/>
        </div>
        <div>
            <h2 class="text-lg font-bold">${video.title}</h2>
            <div class="flex item-center gap-2">
                  <p class="text-gray-600">${video.authors[0].profile_name}</p>
                  ${
                    video.authors[0].verified === true
                    ? `<img class="w-7" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" />` : ""
                  }
            </div>
            <p> <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">Details</button> </p>
        </div>
      </div>
    
    `;
    videoContainer.appendChild(card);
  })
}

const displayCatagories = (catagories) => {
      const categoryContainer = document.getElementById('category');
      catagories.forEach((item) => {
        //crate a button
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})"  class="btn  category-btn">
        ${item.category}
        </button>
        `
        //add button to category container
        categoryContainer.append(buttonContainer)
      });
    
  };


document.getElementById('search-input').addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
})

loadCatagories();
loadVideos();
//create display catagories