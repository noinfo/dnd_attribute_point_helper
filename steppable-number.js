const currentDocument = document.currentScript.ownerDocument;
			
			class SteppableNumber extends HTMLElement {
				_template = `<style>
	:host {
		display: inline-flex;
		flex-direction: row;
		font-size: 16px;
	}
	.steppable-number--value {
		display: inline-box;
		min-width: 3em;
		text-align: center;
		line-height: 2em;
	}
	.steppable-number--button-subtract, .steppable-number--button-add {
		font-size: 16px;
		height: 2em;
		width: 2em;
		text-align: center;
	}
	
</style>
<button id="steppable-number--button-subtract" class="steppable-number--button-subtract">-</button>
<span class="steppable-number--value" id="steppable-number--value">0</span>
<button id="steppable-number--button-add" class="steppable-number--button-add">+</button>`;
				_valueDomNode;
				_shadowRoot;
				constructor() {
					super();
				}

				render() {
					this._valueDomNode.innerText = this.getAttribute('value');
				}

				_addToValue() {
					const currentValue = parseInt(this.getAttribute('value'), 10);
					const maxValue = parseInt(this.getAttribute('max'), 10);
					if(!isNaN(currentValue)){
						if(isNaN(maxValue)){
							// no minimum defined
							this.setAttribute('value', currentValue + 1);
							this._valueChanged();
						}else{
							// only increase if currentValue is not yet maximum
							if(currentValue < maxValue) {
								this.setAttribute('value', currentValue + 1);
								this._valueChanged();
							}
						}
					}
				}
				_subtractFromValue() {
					const currentValue = parseInt(this.getAttribute('value'), 10);
					const minValue = parseInt(this.getAttribute('min'), 10);
					if(!isNaN(currentValue)){
						if(isNaN(minValue)){
							// no minimum defined
							this.setAttribute('value', currentValue - 1);
							this._valueChanged();
						}else{
							// only decrease if currentValue is not yet minimum
							if(currentValue > minValue) {
								this.setAttribute('value', currentValue - 1);
								this._valueChanged();
							}
						}
					}
				}

				_valueChanged() {
					this.render();
					const event = new Event('change', { 'bubbles': true, 'composed': true });
					this._valueDomNode.dispatchEvent(event);
				}

				get value(){
					return this.getAttribute('value');
				}
				set value(newValue){
					this.setAttribute('value', newValue);
					this._valueChanged();
				}

				connectedCallback() {
        	this._shadowRoot = this.attachShadow({mode: 'open'});
					// Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
					// Current document needs to be defined to get DOM access to imported HTML
					const template = document.createElement('template');
					template.innerHTML = this._template;
					const instance = template.content.cloneNode(true);
					this._shadowRoot.appendChild(instance);
					this._valueDomNode = this._shadowRoot.getElementById("steppable-number--value");
					// check if value is set; fallback to 0
					const currentValue = parseInt(this.getAttribute('value'), 10);
					if(isNaN(currentValue)){
						this.setAttribute('value', 0);
					}
					// add event listeners
					this._shadowRoot.getElementById("steppable-number--button-subtract").addEventListener('click', e => {
						this._subtractFromValue();
					});
					this._shadowRoot.getElementById("steppable-number--button-add").addEventListener('click', e => {
						this._addToValue();
					});
					this.render();
      	}
      }
      customElements.define('steppable-number', SteppableNumber);