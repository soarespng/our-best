document.addEventListener("DOMContentLoaded", async () => {
    dayjs.extend(dayjs_plugin_relativeTime);
    dayjs.extend(dayjs_plugin_duration);

    const SUPABASE_URL = 'https://nrvzuwrimkiqhphdsusa.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnp1d3JpbWtpcWhwaGRzdXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwOTI2MDgsImV4cCI6MjA0MTY2ODYwOH0.4bA-YdmS1E-os6sKcLSXZLyiAnvEHSTbM5V5MpLo3kE';
    
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    await createSlider(supabaseClient);
    startTimeTogetherCounter();
});

async function fetchData(supabaseClient) {
    const { data, error } = await supabaseClient
    .storage
    .from('home-images')
    .list('slider-images/');

  if (error) {
    console.error("Erro ao buscar arquivos:", error);
    return [];
  }

  const imageUrls = await Promise.all(data.map(async file => {
    const { data: publicUrlData, error: urlError } = await supabaseClient
      .storage
      .from('home-images')
      .getPublicUrl(`slider-images/${file.name}`);

    if (urlError) {
      console.error("Erro ao obter URL pública:", urlError);
      return null;
    }

    return publicUrlData.publicUrl;
  }));

  return imageUrls;
}

async function createSlider(supabaseClient) {
    const imagesData = await fetchData(supabaseClient);

    const sliderContainer = document.getElementById('image-slider');
    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    
    imagesData.forEach(url => {
        const imgElement = document.createElement('div');
        imgElement.className = 'swiper-slide';
        
        const image = document.createElement('img');
        image.src = url;
        image.alt = "Imagem do Slider";
        
        imgElement.appendChild(image);
        swiperWrapper.appendChild(imgElement);
    });

    sliderContainer.appendChild(swiperWrapper);

    new Swiper('.swiper', {
        loop: true,
        slidesPerView: '2',
        spaceBetween: 10,
        centeredSlides: true, 
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 1000,
            disableOnInteraction: false,
        },
        speed: 2000,
    });
}

function startTimeTogetherCounter() {
    const startDate = dayjs('2023-06-12T22:50:00');
    setInterval(() => {
        const now = dayjs();
        
        const years = now.diff(startDate, 'year');
        const months = now.diff(startDate.add(years, 'year'), 'month');
        const days = now.diff(startDate.add(years, 'year').add(months, 'month'), 'day');
        const hours = now.diff(startDate.add(years, 'year').add(months, 'month').add(days, 'day'), 'hour');
        const minutes = now.diff(startDate.add(years, 'year').add(months, 'month').add(days, 'day').add(hours, 'hour'), 'minute');
        const seconds = now.diff(startDate.add(years, 'year').add(months, 'month').add(days, 'day').add(hours, 'hour').add(minutes, 'minute'), 'second');

        document.getElementById('time-together-counter').innerText =
            `${years} Anos${years !== 1 ? 's' : ''} ${months} Mês${months !== 1 ? 'es' : ''} ${days} Dia${days !== 1 ? 's' : ''} 
            ${hours} Hora${hours !== 1 ? 's' : ''} ${minutes} Minuto${minutes !== 1 ? 's' : ''} ${seconds} Segundo${seconds !== 1 ? 's' : ''}`;
    }, 1000);
}