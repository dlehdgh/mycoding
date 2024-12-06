const groupEl = '.post-group'; // 페이지를 나누는 블럭
const paginateEl = $('#paginate.pagination'); // 페이지 번호를 표시하는 요소

$(document).ready(() => {
	// 마우스 우클릭 금지
	$(docuent).bind('contextmenu', function(e){ return false; });
	// 마우스 드래그 금지
	$('*').bind('selectstart', function(e){ return false; });

	// 코드 도구 생성
	codeToolGenerator();

	// 해딩 태그에 건너뛰기 링크 생성(#링크)
	$('.page-content > h1, .page-content > h2, .page-content > h3, .page-content > h4, .page-content > h5, .page-content > h6').each((i, el) => {
		let id = $(el).attr('id');
		if(id){
			$(el).append(`<a href="#${id}" class="anchor-link" aria-hidden="true" tabindex="-1">#</a>`);
		}
	});

	// 툴팁
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

	pagination(); // 페이징 처리
	btn_share(); // SNS 공유 링크

	// 맨위로 이동 버튼
	$('#btn-back-to-top').click(() => {
		$('html, body').animate({ scrollTop: 0 }, 600);
	});
	// URL 복사
	$('.btn-copy-url').click(() => {
		copyClip(location.href);
	});
	// 인쇄
	$('.btn-print').click(() => {
		window.print();
	});
});

// SNS 공유
const btn_share = () => {
	/* const ds_kakao = "https://story.kakao.com/share?url=";
	const ds_facebook = "https://www.facebook.com/sharer/sharer.php?u=";
	const ds_linkedin = "https://www.linkedin.com/shareArticle?mini=true&url=";
	const ds_twitter = {
		text: "https://twitter.com/intent/tweet?text=",
		url: "&url="
	};
	const ds_navbar = {
		url: "http://share.naver.com/web/shareView.nhn?url=",
		title: "&title="
	};
	const page_url = encodeURIComponent(location.href);
	const page_title = encodeURI(document.title);
	let share_facebook = ds_facebook + page_url;
	let share_twitter = ds_twitter.text + page_title + ds_twitter.url + page_url;
	let share_linkedin = ds_linkedin + page_url;
	let share_naver = ds_navbar.url + page_url + ds_navbar.title + page_title;
	let share_kakao = ds_kakao + page_url;
	*/
	// ========
	const page_url = encodeURIComponent(location.href);
	const page_title = encodeURI(document.title);
	let share_kakao = `https://story.kakao.com/share?url=${page_url}`;
	let share_facebook = `https://www.facebook.com/sharer/sharer.php?u=${page_url}`;
	let share_linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${page_url}`;
	let share_twitter = `https://twitter.com/intent/tweet?text=${page_title}&url=${page_url}`;
	let share_naver = `http://share.naver.com/web/shareView.nhn?url=${page_url}&title=${page_title}`;
	// Facebook 공유
	$('.share-facebook').click(() => {
		window.open(share_facebook);
	});
	// Twitter 공유
	$('.share-twitter').click(() => {
		window.open(share_twitter);
	});
	// LinkedIn 공유
	$('.share-linkedin').click(() => {
		window.open(share_linkedin);
	});
	// 네이버 공유
	$('.share-naver').click(() => {
		window.open(share_naver);
	});
	// 카카오스토리 공유
	$('.share-kakaostory').click(() => {
		window.open(share_kakao);
	});
};

// 페이징 처리 시 다른 페이지로 전환
const pageChange = (page) => {
	let total_page = $(groupEl).length;
	if(page < 1 || page > total_page) return false;
	console.log('page:', page, 'total_page', total_page)
	if(total_page == 1){ // total page is 1
		paginateEl.find('.page-first, .page-last, .page-prev, .page-next').addClass('disabled').attr('disabled', true);
	}else if(page == 1){ // first
		paginateEl.find('.page-first, .page-prev').addClass('disabled').attr('disabled', true);
		paginateEl.find('.page-last, .page-next').removeClass('disabled').attr('disabled', false);
	}else if(page == total_page){ // last
		paginateEl.find('.page-last, .page-next').addClass('disabled').attr('disabled', true);
		paginateEl.find('.page-first, .page-prev').removeClass('disabled').attr('disabled', false);
	}else{
		paginateEl.find('.page-first, .page-last, .page-prev, .page-next').removeClass('disabled').attr('disabled', false);
	}
	paginateEl.find('.page-current').text(page);
	$(groupEl).hide();
	$(`${groupEl}[data-page="${page}"]`).show();
};

// 페이징 처리
const pagination = () => {
	if($(`${groupEl}[data-page]`).length > 0){
		pageChange(1);
		// 페이지 나누기의 더보기 버튼 이벤트
		$('.btn-more').click(function(){
			let page = Number($(this).attr('data-page'));
			if(page == $(this).parent().find(groupEl).length){
				$(this).attr('disabled', true);
			}else{
				$(this).attr('data-page', page);
			}
			$(this).parent().find(`${groupEl}[data-page="${page}"]`).show().find('a').eq(0).focus();
		});
		// 페이지 번호에서 첫번째 페이지와 마지막 페이지로 이동
		paginateEl.find('.page-first, .page-last').click(function(){
			let page = Number($(this).attr('data-page'));
			pageChange(page);
		});
		// 페이지 번호에서 이전 페이지로 이동
		paginateEl.find('.page-prev').click(() => {
			let page = Number(paginateEl.find('.page-current').text()) - 1;
			pageChange(page);
		});
		// 페이지 번호에서 다음 페이지로 이동
		paginateEl.find('.page-next').click(() => {
			let page = Number(paginateEl.find('.page-current').text()) + 1;
			pageChange(page);
		});
		// 페이지 번호에서 입력한 번호의 페이지로 이동
		$('#page-num-form').submit(function(event){
			event.preventDefault();
			let el = event.target['page-num'];
			let page = Number(el.value);
			const min = Number(el.min);
			const max = Number(el.max);
			const current = Number(paginateEl.find('.page-current').text());
			if(page == current) return false;
			if(page >= min && page <= max){
				$(el).val('');
				pageChange(page);
			}
		});
	}
};

// URL 변경 시 페이지 리로딩 막기
const pushState = (name, value) => {
	let url = new URL(location.href);
	url.searchParams.set(name, value);
	window.history.pushState(null, null, url.href);
};

// 코드 도구 생성
const codeToolGenerator = () => {
	let button = '<button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip" data-bs-placement="top"></button>';
	let tools = $('<div class="highlight-tools">');
	tools.append($(button).addClass('btn-copy').attr({ 'aria-label': '코드 복사', 'data-bs-title': '코드 복사' }).html('<i class="fa-solid fa-clipboard" aria-hidden="true"></i>'));
	$('pre').attr('tabindex', '0').before(tools);
	$('.language-html .highlight-tools').prepend($(button).addClass('btn-run me-1').attr({ 'aria-label': '코드 실행', 'data-bs-title': '코드 실행' }).html('<i class="fa-solid fa-caret-right" aria-hidden="true"></i>'))
	/**
	 * 코드 라벨
	 * 코드 라벨을 만들 경우 p 태그에 codeblock-label 클레스를 추가해 주면 되는데 HTML 태그를 수동으로 입력해줘야 하는 불편이 있다. 이러한 코드 라벨을 자동으로 생성하는 코드이다.
	 * 마크다운에서 코드 블럭 다음 줄에 {: data-label="Label"}를 입력하면 '.highlighter-rouge'에 data-label 속성이 추가된 것을 확인할 수 있다. data-label 속성의 값으로 코드 라벨을 생성한다.
	 * 코드 미리보기
	 * data-preview="true"이면 코드 아래에 .highlight-preview 요소를 생성
	 */
	$('.highlighter-rouge').each((i, el) => {
		// 코드 라벨
		const label_class = 'codeblock-label';
		let label = $(el).attr('data-label');
		if(label != undefined && $(el).prev().hasClass(label_class) == false){
			$(el).before(`<p class="${label_class}">${label}</p>`);
		}
		// 코드 미리보기
		let preview = $(el).attr('data-preview');
		if(preview == 'true'){
			let code = $(el).find('pre code').text()
			code = code.replace(/[\n]+$/, '').replaceAll(/\n(<[^/])/g, '<p></p>$1');
			$(el).find('pre.highlight').after(`<div class="highlight-preview">${code}</div>`);
		}
	});
	
	// 코드 도구 버튼 이벤트
	$('.btn-run').click(codeRun);
	$('.btn-copy').click((event) => {
		copyClip($(event.delegateTarget).parent().next().text());
	});
};

// 코드 복사
const copyClip = (content) => {
	if(!content || typeof content != 'string'){
		console.error('Error: 전달 받은 값이 없거나 형식이 올바르지 않습니다.', typeof content, content);
		return false;
	}
	let temp = $('<textarea class="visually-hidden">');
	$('body').append(temp);
	temp.text(content);
	temp.select();
	document.execCommand('copy');
	temp.remove();
};

// 코드 실행
const codeRun = (event) => {
	let code = $(event.delegateTarget).parent().next().text();
	let win = window.open('/blog/example.html', '_blank');
	win.onload = function(){
		win.document.body.innerHTML = code;
	}
};

// 코드 입력란 생성
/* const codeFieldGenerator = () => {
	const generator = function(){
		console.log('code field generator');
		let code = $(this).text().replace(/[\n]+$/, ''); // 마지막 줄의 빈 줄 제거
		let textarea = $('<textarea class="highlight-form form-control"></textarea>').html(code);
		$(this).attr('aria-hidden', 'true').after(textarea);
	};
	// 코드 더블 클릭 시 입력란으로 출력
	$('pre.highlight').dblclick(generator);
	$('.highlighter-rouge').on('focusout', '.highlight-form', function(){
		$(this).removeAttr('aria-hidden').remove();
	});
}; */
