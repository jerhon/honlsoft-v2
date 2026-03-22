<script setup lang="ts">
import { data as projects } from "../../data/projects.data"
import PostList from "../PostList.vue"
</script>

<template>
  <PostList :posts="projects" />
</template>
