<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <div class="input-group mb-3">
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Scene name</span>
            <input type="text" class="form-control" v-model="sceneName" />
          </div>

          <label class="input-group-text" for="inputGroupSelect03"
            >Select a panorama image</label
          >
          <select
            v-model="selectedImage"
            class="form-select"
            id="inputGroupSelect03"
          >
            <option v-for="image in images" :value="image">
              {{ image }}
            </option>
          </select>
        </div>
        <button @click="addScene" type="button" class="btn btn-success">
          Add scene
        </button>
      </div>
      <div class="col-6 overflow-auto">
        <div class="d-flex">
          <img
            v-if="loadPanorama"
            v-for="scene in Object.values(src.scenes)"
            :src="scene.src"
            class="img-thumbnail scene-image"
            :alt="scene.name"
            @click="handleClickImage(scene)"
          />
        </div>
      </div>
    </div>
    <div class="row panorama-wrapper" v-if="loadPanorama">
      <div class="col-9 d-flex">
        <VuePannellum
          :src="src"
          ref="pannellum"
          @click.right="handleClick"
          id="panorama"
        />
        <div class="col-3 m-2">
          <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01"
              >Hotspot type</label
            >
            <select
              v-model="hotSpotType"
              class="form-select"
              id="inputGroupSelect01"
            >
              <option value="info">Info</option>
              <option value="scene">Scene</option>
            </select>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Pitch</span>
            <input
              type="number"
              disabled
              class="form-control"
              v-model="pitch"
            />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Yaw</span>
            <input type="number" disabled class="form-control" v-model="yaw" />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Title</span>
            <input type="text" class="form-control" v-model="infoTitle" />
          </div>
          <div v-if="hotSpotType === 'scene'" class="input-group mb-3">
            <div class="input-group mb-3">
              <label class="input-group-text" for="inputGroupSelect01"
                >Scene</label
              >
              <select
                v-model="selectedScene"
                class="form-select"
                id="inputGroupSelect01"
              >
                <option
                  :value="scene.name"
                  v-for="scene in Object.values(scene)"
                >
                  {{ scene.name }}
                </option>
              </select>
            </div>
          </div>
          <button @click="setHotspot" type="button" class="btn btn-success">
            Set hotspot
          </button>
        </div>
      </div>
    </div>
    <button @click="savePanorama" type="button" class="btn btn-success">
      Save all
    </button>
    <div class="row">
      <div class="col-6 panorama-wrapper">
        <VuePannellum
          :title="'Panorama'"
          :controls="['zoom']"
          :src="savedPanorama"
          v-if="savedPanorama"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import VuePannellum from "vue-pannellum";

const images = ref([
  "../src/assets/19h1n3v-a-360-image-of-boat.jpeg",
  "../src/assets/n7s0cvh-360-panorama-miami-downtown.jpeg",
  "../src/assets/sb0criu-360-panorama-shore.jpeg",
]);
const selectedImage = ref();
const yaw = ref();
const pitch = ref();
const infoTitle = ref("");
const hotSpotType = ref("");
const selectedScene = ref("");
const defaultImage = ref();
const sceneName = ref();
const loadPanorama = ref(false);
const savedPanorama = ref(null);

const src = ref({
  default: {
    firstScene: "",
  },
  scenes: {},
});

//   default: {
//     firstScene: "grid",
//   },
//   scenes: {
//     cube: {
//       name: "cube",
//       type: "equirectangular",
//       src: images.value[0],
//       panorama: images.value[0],
//     },
//     grid: {
//       name: "grid",
//       type: "equirectangular",
//       src: images.value[2],
//       panorama: images.value[2],
//     },
//   },
// };
const pannellum = ref();

function handleClick(e) {
  const cords = pannellum.value.viewer.mouseEventToCoords(e);
  pitch.value = cords[0];
  yaw.value = cords[1];
}

function setHotspot() {
  pannellum.value.viewer.addHotSpot({
    pitch: pitch.value,
    yaw: yaw.value,
    type: hotSpotType.value,
    text: infoTitle.value,
    sceneId: selectedScene.value,
  });

  pitch.value = 0;
  yaw.value = 0;
  hotSpotType.value = "";
  infoTitle.value = "";
  selectedScene.value = "";
}

function savePanorama() {
  // get the whole src what we edited (includes the hotspots). this can be pass the api to save
  savedPanorama.value = pannellum.value.src;
  console.log(savedPanorama.value);
}

function addScene() {
  const newScene = {
    first: {
      name: sceneName.value,
      type: "equirectangular",
      src: selectedImage.value,
      panorama: selectedImage.value,
    },
  };
  const keyName = sceneName.value;
  src.value.default.firstScene = keyName;
  newScene[keyName] = newScene.first;
  delete newScene.first;
  Object.assign(src.value.scenes, newScene);
  loadPanorama.value = true;
  console.log(src.value);
}

function handleClickImage(scene) {
  src.value.default.firstScene = scene.name;

  pannellum.value.viewer
    .getRenderer()
    .render(document.getElementById("panorama"), {
      title: "My Panorama",
      controls: ["zoom"],
      ...src.value,
    });
}
</script>
<style>
.panorama-wrapper {
  height: 600px;
}
.scene-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>
