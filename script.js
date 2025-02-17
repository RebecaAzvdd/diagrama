document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".svg-container");
    const width = container.clientWidth;
    const height = container.clientHeight;

    const nodes = [
      { id: "Frontend", description: "Interface do usuário", icon: "🔧" },
      { id: "Backend", description: "Servidor e lógica de aplicação", icon: "⚙️" },
      { id: "Banco de Dados", description: "Armazena informações", icon: "🗄️" },
      { id: "Armazenamento", description: "Armazena fotos e arquivos", icon: "📂" },
      { id: "Mensageria", description: "Gerencia mensagens", icon: "📩" },
      { id: "Autenticação", description: "Segurança", icon: "🔒" },
      { id: "APIs REST & WebSockets", description: "Comunicação entre frontend e backend", icon: "🔗" },
      { id: "Serviço de Matching", description: "Algoritmo de compatibilidade", icon: "⚙️" },
      { id: "Serviço de Notificações", description: "Envia notificações", icon: "📩" },
      { id: "Autenticação & Segurança", description: "Protege contra ataques", icon: "🔍" },
      { id: "Pagamentos & Assinaturas", description: "Processa pagamentos", icon: "💰" },
      { id: "Monitoramento & Analytics", description: "Analisa métricas", icon: "📊" },
      { id: "Load Balancer", description: "Distribui o tráfego de rede", icon: "🔀" },
  { id: "User Profile Service", description: "Gerencia os perfis dos usuários", icon: "👤" },
  { id: "Geo Location Service", description: "Determina a localização dos usuários", icon: "📍" },
  { id: "Chat Service", description: "Gerencia conversas entre usuários", icon: "💬" },
  { id: "Push Notification Service", description: "Envia notificações push", icon: "🔔" },
  { id: "Media Processing", description: "Processa imagens e vídeos", icon: "🖼️" },
  { id: "Cache", description: "Armazena dados temporariamente", icon: "⚡" },
  { id: "Queue Service", description: "Gerencia filas de tarefas", icon: "📥" },
  { id: "Recommendation Engine", description: "Sugere possíveis matches", icon: "❤️" },
  { id: "Email Service", description: "Envia emails de comunicação", icon: "✉️" },
  { id: "Search Service", description: "Realiza buscas avançadas", icon: "🔎" },

    ];

    const links = [
      { source: "Frontend", target: "Backend" },
      { source: "Frontend", target: "Autenticação" },
      { source: "Frontend", target: "APIs REST & WebSockets" },
      { source: "Backend", target: "Banco de Dados" },
      { source: "Backend", target: "Armazenamento" },
      { source: "Backend", target: "Mensageria" },
      { source: "Backend", target: "APIs REST & WebSockets" },
      { source: "Backend", target: "Serviço de Matching" },
      { source: "Backend", target: "Serviço de Notificações" },
      { source: "Backend", target: "Autenticação & Segurança" },
      { source: "Backend", target: "Pagamentos & Assinaturas" },
      { source: "Backend", target: "Monitoramento & Analytics" },
      { source: "Frontend", target: "Load Balancer" },
      { source: "Load Balancer", target: "Backend" },
      { source: "Backend", target: "User Profile Service" },
      { source: "Backend", target: "Geo Location Service" },
      { source: "Backend", target: "Chat Service" },
      { source: "Backend", target: "Push Notification Service" },
      { source: "Backend", target: "Media Processing" },
      { source: "Backend", target: "Cache" },
      { source: "Backend", target: "Queue Service" },
      { source: "Backend", target: "Recommendation Engine" },
      { source: "Backend", target: "Email Service" },
      { source: "Backend", target: "Search Service" },
      { source: "APIs REST & WebSockets", target: "Chat Service" },
  { source: "APIs REST & WebSockets", target: "Push Notification Service" },
    ];

    const svg = d3.select("#diagram")
                  .attr("width", width)
                  .attr("height", height);

    // Cria as linhas (links)
    const link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link");

    // Cria um grupo para cada nó
    const node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("click", function(event, d) {
            modal.style.display = "block";
            modalTitle.textContent = d.id;
            modalDescription.textContent = d.description;
        });

    // Adiciona o retângulo do nó com largura inicial (será ajustada)
    node.append("rect")
        .attr("width", 160)
        .attr("height", 50)
        .attr("rx", 10)
        .attr("ry", 10);

    // Adiciona o ícone à esquerda (posição: x=10, y=25 para centralizar verticalmente)
    node.append("text")
        .attr("class", "icon")
        .attr("x", 10)
        .attr("y", 25)
        .text(d => d.icon);

    // Adiciona a label, posicionada após o ícone (x=44)
    node.append("text")
        .attr("class", "label")
        .attr("x", 44)
        .attr("y", 25)
        .text(d => d.id);

    // Ajusta dinamicamente a largura do retângulo conforme o comprimento da label.
    // Calcula: espaço para ícone e gap (44px) + largura do texto + margem extra (10px)
    node.each(function(d) {
      const labelEl = d3.select(this).select("text.label").node();
      const textLength = labelEl.getComputedTextLength();
      const newWidth = 44 + textLength + 10;
      d.width = newWidth; // armazena a largura calculada em cada nó
      d3.select(this).select("rect").attr("width", newWidth);
    });

    // Cria a simulação de forças (usando a largura dinâmica para colisão e links)
    // Cria a simulação de forças com parâmetros ajustados:
const simulation = d3.forceSimulation(nodes)
// Aumenta a distância dos links para 200px (ao invés de 150)
.force("link", d3.forceLink(links).id(d => d.id).distance(200))
// Aumenta a força de repulsão para dispersar melhor os nós
.force("charge", d3.forceManyBody().strength(-600))
// Mantém os nós centralizados no container
.force("center", d3.forceCenter(width / 2, height / 2))
// Aumenta o raio de colisão para evitar sobreposição (considera o tamanho dinâmico do nó)
.force("collision", d3.forceCollide().radius(d => (d.width ? d.width / 2 : 80) + 20))
// Forças adicionais para incentivar a dispersão ao longo dos eixos X e Y
.force("x", d3.forceX(width / 2).strength(0.05))
.force("y", d3.forceY(height / 2).strength(0.05))
.on("tick", ticked);


    function ticked() {
      // Impede que os nós ultrapassem os limites do SVG, considerando a largura dinâmica
      nodes.forEach(d => {
        const nodeWidth = d.width || 160;
        d.x = Math.max(0, Math.min(width - nodeWidth, d.x));
        d.y = Math.max(0, Math.min(height - 50, d.y));
      });

      // Atualiza a posição dos nós
      node.attr("transform", d => `translate(${d.x}, ${d.y})`);

      // Atualiza a posição dos links conectando os centros dos nós
      link.attr("x1", d => d.source.x + (d.source.width ? d.source.width / 2 : 80))
          .attr("y1", d => d.source.y + 25)
          .attr("x2", d => d.target.x + (d.target.width ? d.target.width / 2 : 80))
          .attr("y2", d => d.target.y + 25);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Modal
    const modal = document.getElementById("modal");
    const closeModalBtn = document.getElementById("close");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");

    closeModalBtn.onclick = function() {
        modal.style.display = "none";
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
  });