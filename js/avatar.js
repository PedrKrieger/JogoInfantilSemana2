/*
 * Lógica do personagem.
 * O avatar é desenhado com HTML e CSS para funcionar sem imagens externas.
 */
const AVATAR_OPTIONS = {
  skinColors: [
    { id: "pele-clara", label: "Clara", value: "#ffd8b5" },
    { id: "pele-rosada", label: "Rosada", value: "#f5b895" },
    { id: "pele-media", label: "Média", value: "#c98557" },
    { id: "pele-escura", label: "Escura", value: "#8d5638" },
    { id: "pele-retinta", label: "Retinta", value: "#5f3525" }
  ],
  eyeColors: [
    { id: "olho-castanho", label: "Castanho", value: "#5b351d" },
    { id: "olho-azul", label: "Azul", value: "#2f80ed" },
    { id: "olho-verde", label: "Verde", value: "#219653" },
    { id: "olho-mel", label: "Mel", value: "#b7791f" },
    { id: "olho-preto", label: "Preto", value: "#1f2933" }
  ],
  hairStyles: [
    { id: "curto", label: "Curto" },
    { id: "cacheado", label: "Cacheado" },
    { id: "franja", label: "Franja" },
    { id: "coque", label: "Coque" },
    { id: "trancas", label: "Tranças" }
  ],
  hairColors: [
    { id: "cabelo-castanho", label: "Castanho", value: "#5a3825" },
    { id: "cabelo-preto", label: "Preto", value: "#202124" },
    { id: "cabelo-loiro", label: "Loiro", value: "#e7ba55" },
    { id: "cabelo-ruivo", label: "Ruivo", value: "#b94f2f" },
    { id: "cabelo-colorido", label: "Roxo", value: "#8e44ad" }
  ],
  outfits: [
    { id: "macacao-azul", label: "Macacão azul", primary: "#3b82f6", secondary: "#fef3c7", emoji: "⭐" },
    { id: "vestido-rosa", label: "Roupa rosa", primary: "#ec4899", secondary: "#fde68a", emoji: "♥" },
    { id: "camisa-verde", label: "Roupa verde", primary: "#22c55e", secondary: "#dbeafe", emoji: "🌳" },
    { id: "jaqueta-amarela", label: "Roupa amarela", primary: "#facc15", secondary: "#93c5fd", emoji: "☀" },
    { id: "camiseta-laranja", label: "Roupa laranja", primary: "#fb923c", secondary: "#bbf7d0", emoji: "●" }
  ]
};

const defaultAvatarState = {
  name: "Amiguinho",
  skinColor: AVATAR_OPTIONS.skinColors[0].value,
  eyeColor: AVATAR_OPTIONS.eyeColors[0].value,
  hairStyle: AVATAR_OPTIONS.hairStyles[0].id,
  hairColor: AVATAR_OPTIONS.hairColors[0].value,
  outfit: AVATAR_OPTIONS.outfits[0]
};

function normalizeName(name) {
  const cleanName = String(name || "").trim();
  return cleanName || "Amiguinho";
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function createAvatarMarkup(state, sizeClass = "") {
  const safeState = {
    ...defaultAvatarState,
    ...state,
    name: normalizeName(state && state.name)
  };

  const outfit = safeState.outfit || defaultAvatarState.outfit;

  return `
    <div
      class="avatar ${sizeClass}"
      data-hair="${safeState.hairStyle}"
      style="
        --skin-color: ${safeState.skinColor};
        --eye-color: ${safeState.eyeColor};
        --hair-color: ${safeState.hairColor};
        --outfit-primary: ${outfit.primary};
        --outfit-secondary: ${outfit.secondary};
      "
      aria-label="Personagem ${escapeAttribute(safeState.name)}"
      role="img"
    >
      <div class="avatar__hair avatar__hair--back"></div>
      <div class="avatar__head">
        <div class="avatar__hair avatar__hair--front"></div>
        <div class="avatar__hair avatar__hair--bun"></div>
        <div class="avatar__hair avatar__hair--braid avatar__hair--braid-left"></div>
        <div class="avatar__hair avatar__hair--braid avatar__hair--braid-right"></div>
        <span class="avatar__ear avatar__ear--left"></span>
        <span class="avatar__ear avatar__ear--right"></span>
        <span class="avatar__eye avatar__eye--left"></span>
        <span class="avatar__eye avatar__eye--right"></span>
        <span class="avatar__cheek avatar__cheek--left"></span>
        <span class="avatar__cheek avatar__cheek--right"></span>
        <span class="avatar__smile"></span>
      </div>
      <div class="avatar__neck"></div>
      <div class="avatar__body">
        <span class="avatar__badge">${outfit.emoji}</span>
      </div>
      <div class="avatar__arm avatar__arm--left"></div>
      <div class="avatar__arm avatar__arm--right"></div>
    </div>
  `;
}

function cloneDefaultAvatar() {
  return {
    ...defaultAvatarState,
    outfit: { ...defaultAvatarState.outfit }
  };
}

window.AvatarCreator = {
  options: AVATAR_OPTIONS,
  defaultState: defaultAvatarState,
  normalizeName,
  createAvatarMarkup,
  cloneDefaultAvatar
};
