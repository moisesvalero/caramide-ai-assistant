var e=[],t=document.getElementById(`chat-window`),n=document.getElementById(`chat-messages`),r=document.getElementById(`chat-input`),i=document.getElementById(`chat-send`),a=document.getElementById(`chat-typing`),o=document.getElementById(`reset-chat`),s=document.querySelectorAll(`.prompt-chip`);r.addEventListener(`focus`,()=>{r.parentElement.parentElement.classList.add(`ring-2`,`ring-secondary/20`)}),r.addEventListener(`blur`,()=>{r.parentElement.parentElement.classList.remove(`ring-2`,`ring-secondary/20`)}),r.addEventListener(`keypress`,e=>{e.key===`Enter`&&u()}),i.addEventListener(`click`,u),o.addEventListener(`click`,l),s.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.textContent.trim(),n=``;n=t===`Piel Grasa`?`Tengo la piel grasa y me salen brillos, ¿qué me recomiendas?`:t===`Antiarrugas`?`Busco un tratamiento antiarrugas potente, ¿qué tenéis?`:t===`Hidratación profunda`?`Tengo la piel deshidratada y tirante, ¿cómo la hidrato?`:t===`Manchas Solares`?`Me han salido manchas del sol en la cara, ¿cómo las reduzco?`:t,r.value=n,u()})});function c(e){let t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/\*\*(.*?)\*\*/g,`<strong>$1</strong>`),t=t.replace(/^\s*-\s*(.*?)$/gm,`• $1`),t=t.replace(/\n/g,`<br>`),t}function l(){e=[],n.innerHTML=`
                <div class="flex gap-4 items-start">
                    <span class="material-symbols-outlined text-secondary bg-surface-container-low border border-outline-variant p-2 text-lg">auto_awesome</span>
                    <div class="flex-1 bg-surface-container-lowest border border-outline-variant p-4 text-on-surface text-[15px] leading-relaxed">
                        <p class="mb-2"><strong>¡Hola!</strong> Soy tu asesor de dermatología Larimide.</p>
                        <p>Dime qué tipo de piel tienes o qué inquietud quieres tratar (arrugas, imperfecciones, manchas, hidratación) y te diseñaré una rutina clínica personalizada con nuestros productos oficiales.</p>
                    </div>
                </div>
            `,t.classList.add(`hidden`),r.value=``}async function u(){let o=r.value.trim();if(o){r.value=``,t.classList.contains(`hidden`)&&(t.classList.remove(`hidden`),t.scrollIntoView({behavior:`smooth`,block:`center`})),d(`user`,o),e.push({role:`user`,content:o}),a.classList.remove(`hidden`),n.scrollTop=n.scrollHeight,i.disabled=!0,i.innerHTML=`Analizando... <span class="material-symbols-outlined animate-spin text-[18px]">autorenew</span>`;try{let t=await fetch(`/api/chat`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({messages:e})}),n=await t.json();a.classList.add(`hidden`),t.ok&&n.reply?(d(`assistant`,n.reply),e.push({role:`assistant`,content:n.reply})):d(`error`,n.error||`Ocurrió un error al procesar tu solicitud.`)}catch(e){a.classList.add(`hidden`),d(`error`,`Error de conexión con el servidor. Por favor, inténtalo de nuevo.`),console.error(`Chat error:`,e)}finally{i.disabled=!1,i.innerHTML=`Analizar <span class="material-symbols-outlined">arrow_forward</span>`,n.scrollTop=n.scrollHeight}}}function d(e,t){let r=document.createElement(`div`);r.className=`flex gap-4 items-start`,e===`user`?r.innerHTML=`
                    <span class="material-symbols-outlined text-primary bg-surface-container-low border border-outline-variant p-2 text-lg">person</span>
                    <div class="flex-1 bg-surface-container-low border border-outline-variant p-4 text-on-surface text-[15px] leading-relaxed">
                        <strong>Tú:</strong><br>
                        ${t}
                    </div>
                `:e===`assistant`?r.innerHTML=`
                    <span class="material-symbols-outlined text-secondary bg-surface-container-low border border-outline-variant p-2 text-lg">auto_awesome</span>
                    <div class="flex-1 bg-surface-container-lowest border border-outline-variant p-4 text-on-surface text-[15px] leading-relaxed">
                        <strong>Larimide AI Assistant:</strong><br>
                        <div class="mt-2">${c(t)}</div>
                    </div>
                `:e===`error`&&(r.innerHTML=`
                    <span class="material-symbols-outlined text-error bg-error-container p-2 text-lg">warning</span>
                    <div class="flex-1 bg-error-container border border-error p-4 text-error text-[15px] leading-relaxed">
                        <strong>Sistema:</strong><br>
                        ${t}
                    </div>
                `),n.appendChild(r),n.scrollTop=n.scrollHeight}