if (typeof currentDocument === "undefined") {
  const currentDocument = document.currentScript.ownerDocument;
}
class AttributeRow extends HTMLElement {
  _template = `
<style>
.attribute_wrapper {
  display: flex;
  flex-direction: row;
  max-width: 640px;
  justify-self: center;
}
.with_margin {
  margin: 0 0.2rem;
}

.attr_name {
  flex: 1;
}
.attribute,
.bonus {
  flex: 1;
  text-align: center;
  box-sizing: border-box;
  justify-content: center;
}
.modifier,
.total {
  flex: 1;
  min-width: 3em;
  text-align: center;
  line-height: 2em;
}
</style>  
<p class="attribute_wrapper">
<span class="attr_name"><slot></slot></span>
<steppable-number value="8" min="8" max="18" id="attr" class="bonus with_margin"></steppable-number>
<steppable-number value="0" min="-10" max="10" id="attr_bonus" class="bonus with_margin"></steppable-number>
<span class="total" id="attr_total">8</span>
<span class="modifier" id="attr_mod">-1</span>
</p>`;
  _attrDomNode;
  _attr_bonusDomNode;
  _attr_totalDomNode;
  _attr_modDomNode;

  _shadowRoot;
  constructor() {
    super();
  }

  render() {
    // this._attrDomNode.innerText = this.getAttribute('value');
    this._setModifierAndTotalFromAttribute();
  }
  // get modifier from attribute value as defined by the D&D Players Handbook
  _getModifier(attribute_value) {
    return Math.floor((attribute_value - 10) / 2);
  }
  _setModifierAndTotalFromAttribute() {
    if (
      !this._attrDomNode ||
      !this._attr_bonusDomNode ||
      !this._attr_totalDomNode ||
      !this._attr_modDomNode
    ) {
      console.error("attribute, modifier or bonus dom node not found ", this);
      return;
    }
    const attribute_value = parseInt(this._attrDomNode.value, 10);
    const bonus_value = parseInt(this._attr_bonusDomNode.value, 10);
    if (!isNaN(attribute_value) && !isNaN(bonus_value)) {
      this._attr_modDomNode.innerText = this._getModifier(
        attribute_value + bonus_value
      );
      this._attr_totalDomNode.innerText = attribute_value + bonus_value;
    }
    return;
  }

  get value() {
    return this._attrDomNode.value;
  }
  set value(newValue) {
    this._attrDomNode.value = newValue;
    this.render();
  }
  reset() {
    const initialvalue = parseInt(this.getAttribute("initialvalue"), 10);
    this._attrDomNode.value = isNaN(initialvalue) ? 8 : initialvalue;
    this._attr_bonusDomNode.value = 0;
    this.render();
  }
  connectedCallback() {
    this._shadowRoot = this.attachShadow({ mode: "open" });
    // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
    // Current document needs to be defined to get DOM access to imported HTML
    const template = document.createElement("template");
    template.innerHTML = this._template;

    const instance = template.content.cloneNode(true);
    this._shadowRoot.appendChild(instance);
    // save child dom nodes for later use
    this._attrDomNode = this._shadowRoot.getElementById("attr");
    this._attr_bonusDomNode = this._shadowRoot.getElementById("attr_bonus");
    this._attr_totalDomNode = this._shadowRoot.getElementById("attr_total");
    this._attr_modDomNode = this._shadowRoot.getElementById("attr_mod");

    // check if initialvalue is set; fallback to 8
    const initialvalue = parseInt(this.getAttribute("initialvalue"), 10);
    this._attrDomNode.value = isNaN(initialvalue) ? 8 : initialvalue;
    // add event listeners
    this._attrDomNode.addEventListener("click", e => {
      this.render();
    });
    this._attr_bonusDomNode.addEventListener("click", e => {
      this.render();
    });
    this.render();
  }
}
customElements.define("attribute-row", AttributeRow);
