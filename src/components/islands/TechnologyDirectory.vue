<script setup lang="ts">
import { computed, ref } from 'vue'

export interface SuiteEntry {
  id: string; name: string; tagline: string; domain: string; logo?: string
  domainName: string; org: string; softwares: number; logoDark?: string; logoClass?: string; deprecated?: boolean
}
const props = defineProps<{ suites: SuiteEntry[]; domains: { id: string; name: string }[] }>()

const failed = ref<Record<string, boolean>>({})
const failedDark = ref<Record<string, boolean>>({})
const query = ref('')
const domain = ref('all')
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  return props.suites.filter((s) => {
    if (domain.value !== 'all' && s.domain !== domain.value) return false
    if (!q) return true
    return `${s.name} ${s.tagline} ${s.org}`.toLowerCase().includes(q)
  })
})
const reset = () => { query.value = ''; domain.value = 'all' }
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label class="sr-only" for="tech-search">Search technologies</label>
      <div class="relative w-full sm:max-w-xs">
        <input
          id="tech-search"
          v-model="query"
          type="search"
          placeholder="Search suites, orgs…"
          class="w-full rounded-xl border border-line bg-white px-4 py-3 pr-9 text-base text-ink outline-none transition placeholder:text-slate-400 focus-visible:border-brand-500 dark:border-slate-700 dark:bg-ink-2 dark:text-slate-100"
        >
        <button
          v-if="query"
          type="button"
          class="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-ink dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Clear search"
          @click="query = ''"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by domain">
        <button
          class="news-filter-chip"
          :aria-pressed="domain === 'all'"
          @click="domain = 'all'"
        >All</button>
        <button
          v-for="d in domains"
          :key="d.id"
          class="news-filter-chip"
          :aria-pressed="domain === d.id"
          @click="domain = d.id"
        >{{ d.name }}</button>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between gap-3">
      <p class="text-sm text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
        {{ matches.length }} of {{ suites.length }} suites
      </p>
      <button
        v-if="query || domain !== 'all'"
        type="button"
        class="text-sm font-semibold text-brand-600 no-underline hover:underline dark:text-brand-400"
        @click="reset"
      >Reset</button>
    </div>

    <TransitionGroup
      tag="ul"
      name="tech-grid"
      class="mt-4 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li v-for="s in matches" :key="s.id">
        <a :href="`/technologies/${s.id}`" class="card group flex h-full flex-col p-5">
          <div class="flex items-center gap-3">
            <template v-if="s.logo && !failed[s.id]">
              <img v-if="s.logoDark && !failedDark[s.id]" :src="s.logo" alt="" width="32" height="32" class="h-8 w-8 shrink-0 dark:hidden" loading="lazy" @error="failed[s.id] = true">
              <img v-if="s.logoDark && !failedDark[s.id]" :src="s.logoDark" alt="" width="32" height="32" class="hidden h-8 w-8 shrink-0 dark:block" loading="lazy" @error="failedDark[s.id] = true">
              <img v-if="!s.logoDark" :src="s.logo" alt="" width="32" height="32" :class="['h-8 w-8 shrink-0', s.logoClass]" loading="lazy" @error="failed[s.id] = true">
            </template>
            <span v-else class="logo-tile h-8 w-8 shrink-0 text-xs font-bold">{{ s.name.slice(0, 1) }}</span>
            <h3 class="text-lg font-semibold leading-tight group-hover:text-brand-700 dark:group-hover:text-brand-300">{{ s.name }}</h3>
          </div>
          <p class="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{{ s.tagline }}</p>
          <p class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-500">
            <span class="rounded-full border border-line px-2.5 py-1 font-medium dark:border-slate-700">{{ s.domainName }}</span>
            <span>{{ s.softwares }} repositories</span>
            <span aria-hidden="true">·</span>
            <span class="font-mono">{{ s.org }}</span>
          </p>
        </a>
      </li>
    </TransitionGroup>

    <p v-if="!matches.length" class="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
      No suites match. <button type="button" class="font-semibold text-brand-600 underline underline-offset-4 dark:text-brand-400" @click="reset">Reset filters</button>
    </p>
  </div>
</template>
