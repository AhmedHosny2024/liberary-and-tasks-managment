<template>
  <div class="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md">
    <div class="flex justify-between mb-4 flex-row">
      <h3 class="text-xl font-semibold">Tasks</h3>
      <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Add Task
      </button>
    </div>
    <section class="py-4">
      <div class="container-xl lg:container m-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <CartItem
            v-for="task in tasks"
            :key="task.id"
            :cart=task
            class="mb-4"
            :markCompleted="markCompleted"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import CartItem from './CartItem.vue'

import { ref, onMounted } from 'vue'
import axios from 'axios'

const tasks = ref([])

const fetchTasks = async () => {
  // const res = await axios.get('/api/tasks') // Replace with your actual API endpoint
  // tasks.value = res.data
  tasks.value = [{id:1,title:"Antea ocer alias adstringo totam adamo voluptatum campana allatus.",description:"Volaticus cavus suggero accedo carus caritas odit theologus carus considero. Spiculum accusator animi atavus autus usus beatae. Delibero abutor tamen.",dueDate:"2025-12-07",priority:1,status:"completed"},{id:2,title:"Placeat accedo ratione trans terminatio.",description:"Debilito acidus usque. Arca coruscus condico clibanus teres ustilo cavus amitto voro. Contigo collum ultra apostolus casus.",dueDate:"2026-02-18",priority:2,status:"completed"},{id:4,title:"Sponte aeternus debilito vaco pecto.",description:"Umbra candidus tabula attero aperte subseco ubi vinculum teneo. Corpus sollers omnis. Abutor aut neque.",dueDate:"2026-03-28",priority:4,status:"todo"},{id:5,title:"Deorsum amplus credo comburo ventosus pectus.",description:"Vobis alveus somniculosus auctus denique occaecati desparatus. Umerus ceno conforto verbera cursus crustulum coaegresco. Amaritudo creber sui aestus comes addo undique saepe abutor corona.",dueDate:"2025-05-31",priority:5,status:"completed"},{id:6,title:"Eos tepidus nemo voveo maiores.",description:"Et quis cursim ea. Aureus acidus strenuus natus attollo cultura comburo. Tamisium spero utpote vorago versus voluptatem derelinquo socius ustilo.",dueDate:"2026-02-16",priority:1,status:"completed"},{id:7,title:"Quibusdam tantillus aspicio reiciendis decor cunae commodo.",description:"Attero sublime ustilo capto quasi condico uterque officiis quidem theologus. Aliquam vobis cogito cognatus. Comis confugo clibanus accusator delego aer.",dueDate:"2025-06-02",priority:2,status:"completed"},{id:8,title:"Cura condico voco.",description:"Porro termes umbra tenus aspicio. Barba volaticus sollicito odit aspicio. Placeat non candidus barba explicabo ustilo admoneo tempora degero.",dueDate:"2025-10-05",priority:3,status:"todo"},{id:9,title:"Voluptate celebrer vulgus desidero volo convoco aliqua ab cito.",description:"Cito spectaculum tremo corporis. Cotidie atavus auditor fugit atque volva. Vigilo vilis voluptas volutabrum confugo cognomen.",dueDate:"2026-01-03",priority:4,status:"completed"},{id:10,title:"Minima traho cresco cultura adflicto.",description:"Vestrum absque autus bos auditor. Celebrer amoveo vesper xiphias vomer solum tristis voluntarius ventito atque. Talus derelinquo arguo.",dueDate:"2025-07-29",priority:5,status:"completed"},{id:11,title:"Delego voro usque amoveo conqueror cohaero delectatio.",description:"Appono brevis admiratio tam depono tredecim. Delibero defluo compono torqueo aut cenaculum celo accommodo curvo congregatio. Vado cotidie placeat creo tamen tergo.",dueDate:"2025-09-13",priority:1,status:"todo"},{id:12,title:"Cubo usque admoneo quasi asporto qui viriliter carpo contigo trucido.",description:"Bibo spes vacuus umquam super sponte summa. Nam caritas aspernatur sit studio ait tactus adduco. Celer acidus textus aufero causa constans.",dueDate:"2025-04-26",priority:2,status:"todo"},{id:13,title:"Aspicio canto angustus tersus exercitationem.",description:"Tabgo crustulum alius tero curto esse doloribus. Villa vulgo barba veritatis tricesimus aequus. Speciosus cena sui.",dueDate:"2025-09-28",priority:3,status:"todo"},{id:14,title:"Tendo pecco spectaculum ait doloribus casso aedificium delinquo.",description:"Universe volutabrum attero vox crepusculum theca vicissitudo aestivus necessitatibus cupio. Omnis votum summa admitto arto vulpes pecco utique sodalitas. Amissio celer virga tendo aperte absum.",dueDate:"2026-01-17",priority:4,status:"todo"},{id:15,title:"Pecco aut magni tersus canto corpus odio delego.",description:"Tergeo itaque eius synagoga adstringo cena desidero. Virgo deserunt amo aetas quas comedo caterva tamdiu. Solium audentia comptus tredecim.",dueDate:"2025-07-19",priority:5,status:"completed"},{id:16,title:"Adamo comprehendo amplus fugit alienus error sunt.",description:"Animus catena adsum theatrum reprehenderit adversus valetudo. Sint adipiscor amplexus tunc temptatio alias. Ullam terror audentia celer suppellex.",dueDate:"2025-09-02",priority:1,status:"completed"}]
}

const markCompleted = async (id) => {
  await axios.put(`/api/tasks/${id}`, { status: 'completed' })
  fetchTasks()
}

onMounted(fetchTasks)
</script>
