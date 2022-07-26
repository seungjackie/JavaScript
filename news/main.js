let news = []; // item 하나하나 꺼내서 html으로 해야한다.
let page = 1;
let total_pages = 1;
let menus = document.querySelectorAll(".menus button");
// console.log("menus", menus);

menus.forEach((menu) =>
  menu.addEventListener("click", () => getNewsByTopic(event))
);

// 전역 변수로 사용
let url;

// 각 함수에서 필요한 url 만 만든다
// api 호출 함수 호출

//핸들링 해야하는 에러 는 어떤 경우일까

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "k2RJsMMioKi7o0etZG-MiI5ivcVgeY6TWE6wdjYK6JM",
    });
    url.searchParams.set("page", page); //&page= 동적인
    // 비동기 작업
    let response = await fetch(url, { headers: header }); //ajax, axios, fetch , 함수는 각각 에서 url 로 했다.
    // console.log("url", url);
    //   console.log(response); // promise
    // await 없을 시 response.json is not a function
    let data = await response.json(); // 객체화, 시간이 걸린다
    // console.log("this is data", data);
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색 된 결과값이 없습니다.");
      }
      news = data.articles;
      // total
      total_pages = data.total_pages;
      // 현재 페이지
      page = data.page;
      // totalPage = data.total_page;
      // console.log("news", news);
      console.log("받은 데이터는", data);
      render();
      pagenation();
    } else {
      throw new Error(data.message);
    }
    // console.log("response", response); // status 상태로 에러를 확인 할수 있다. cors 에러
    // console.log("data", data); // messag
    // console.log("data total", data.total_pages);

    // render();
  } catch (error) {
    // 에러 핸들링
    console.log("잡힌건 에러는", error.message);
    errorMessage(error.message);
  }
};

const getLatestNews = async () => {
  // new URL class화, 객체형식으로 들어온다. 분석해준다.
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  console.log("클릭됨", event.target.textContent);

  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();

  // console.log("data", data);
};

const getNewsByKeywords = async () => {
  // 1. 검색 키워드 읽어오기
  // 2. url에 검색 키워드 붙치기
  // 3. 헤더준비
  // 4. url 부르기
  // 5. 데이터 부르기
  // 6. 데이터 가져오기
  let keyword = document.getElementById("search-input").value;
  console.log("keyword", keyword);

  url = new URL(`
  https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `
            <div class="row news">
                <div class ="col-lg-4">
                    <img class="news-img-size" src='${item.media}' />
                </div>
                <div class="col-lg-8">
                    <h2>${item.title}</h2>
                    <p>
                        ${item.summary}
                    </p>
                    <div>
                        ${item.rights} * ${item.published_date}
                    </div>
                </div>
            </div>
            `;
    })
    .join(""); // , arrayv -> string

  // console.log(newsHTML); // array type 이다

  document.getElementById("news-board").innerHTML = newsHTML; // 붙혀 넣기
};

const errorMessage = (message) => {
  // bootstrap error
  let errHTML = `<div class="alert alert-warning text-center"  role="alert">${message} </div>`;
  document.getElementById("news-board").innerHTML = errHTML;
};

const pagenation = () => {
  let pagenationHTML = ``;
  // total 페이지
  // 내가 어떤페이지를 보고있는지
  // 페이지 그룹
  let pageGroup = Math.ceil(page / 5);
  // console.log("pageGroup", pageGroup);
  // 라스트 페이지
  let last = pageGroup * 5;
  if (last > total_pages) {
    last = total_pages;
  }

  // console.log(last);
  // 처음 페이지
  // 첫 페이지는 1
  let first = last - 4 <= 0 ? 1 : last - 4;
  // 처음부터 끝까지 페이지 프린트

  // total page =3 last 와 first 규칙
  // << 이거 만들어 주기
  // 내가 그룹 1 일때 << < 이 버튼이 없다
  // 마지막일때 >> > 가 없다

  if (first >= 6) {
    pagenationHTML = `
  <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="movoToPage(1)" >
      &laquo;</span>
    </a>
  </li>
  <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="movoToPage(${
      page - 1
    })">
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`;
  }

  // 처음 값
  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : null
    } " ><a class="page-link" href="#" onclick="movoToPage(${i})">${i}</a></li>`;
    // console.log("pageg   ", pagenationHTML);
  }

  if (last < total_pages) {
    pagenationHTML += `
  <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="movoToPage(${
      page + 1
    })">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>
  <li class="page-item"  onclick="movoToPage(${total_pages})">
    <a class="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
  `;
  }
  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const movoToPage = (pageNum) => {
  //1. 이동 하고싶은 페이지를 알아야지.
  page = pageNum;
  //2. 이동하고싶은 페이지를 가지고 api를 다시 호출해주자
  getNews();
};

// hoisting 때문에 그렇다..
let searchButton = document.getElementById("search-button");
// console.log("button  11", searchButton);

searchButton.addEventListener("click", () => getNewsByKeywords());

getLatestNews();
