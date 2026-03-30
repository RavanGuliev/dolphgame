<script setup lang="ts">
import {paginateStore} from "~/stores/paginateStore";
import {computed} from "vue";
import {loadingStore} from "~/stores/loadingStore";
const loadStore = loadingStore()
const {setLoading} = loadStore

const store = paginateStore()
const {$api} = useNuxtApp()
const props = defineProps({
  pagination: {
    type: Object
  },
  params: {
    type: Object,
  },
  forWhat: {
    type: String
  },
  headers: {
    default: {}
  }
})

const { pagination, params, forWhat, headers} = props
const current_page = computed(() => props.pagination.current_page)

const pages = computed(() => {
  const currentPage = pagination.current_page;
  const lastPage = pagination.last_page;
  const maxVisiblePages = 15;
  let start = currentPage - Math.floor(maxVisiblePages / 2);
  start = Math.max(start, 1);
  let end = start + maxVisiblePages - 1;
  end = Math.min(end, lastPage);

  if (end - start + 1 < maxVisiblePages) {
    end = Math.min(maxVisiblePages, lastPage);
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  const visiblePages = [];
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }
  return visiblePages;
})
const removeUrlParameter = (url:string, paramKey:string) => {
  let r = new URL(url);
  r.searchParams.delete(paramKey);
  return r.href;
}
const objectToQueryString = () => {
  const obj = params;
  if (obj) {
    return '&' + Object.keys(obj)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
  }
  return ''
}
const changePage = (url:string, page:number) => {
  url = removeUrlParameter(url, 'page')
  setLoading(true)
  $api.get(url + `?page=${page}` + objectToQueryString(), headers).then(res => {
    if (forWhat === 'comment') {
      store.setPaginateData(res)
    } else {
      store.setPaginateData(res)
    }
  }).finally(() => {
    setLoading(false)
    if (process.client) {
      window.scrollTo(0, 0);
    }
  })
}
</script>

<template>
  <div v-if="pagination.last_page > 1" class="col-md-12 static-pagination">
    <div class="pagination p1 text-center">
      <ul class="page-pag list-inline">
        <li v-if="current_page > 1" class="list-inline-item"><a
            @click.prevent="changePage(pagination.links[1].url, page -1)" style="cursor: pointer" v-text="'<'"></a></li>
        <li v-for="page in pages" class="list-inline-item"><a
            :class="{'is-active': page === current_page}"
            @click.prevent="changePage(pagination.links[1].url, page)" style="cursor: pointer" v-text="page"></a></li>
        <li v-if="current_page < pagination.last_page" class="list-inline-item"><a
            @click.prevent="changePage(pagination.links[1].url, page + 1)" style="cursor: pointer" v-text="'>'"></a></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>