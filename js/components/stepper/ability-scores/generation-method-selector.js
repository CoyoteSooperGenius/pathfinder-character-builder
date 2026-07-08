// Generation Method Selector Component
// Allows user to choose between Point Buy, Standard Array, Dice Roll, and Manual Entry methods

Vue.component('generation-method-selector', {
  props: {
    selectedMethod: {
      type: String,
      required: true,
      default: 'pointBuy'
    }
  },

  methods: {
    onMethodChanged(method) {
      this.$emit('method-changed', method);
    }
  },

  template: `
    <div class="generation-method-selector">
      <div class="mb-4">
        <div>
          <pf-card title="Choose Generation Method">
            <div class="pf-grid pf-grid--2">
              <div>
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    name="ability-generation-method"
                    :value="'pointBuy'"
                    :checked="selectedMethod === 'pointBuy'"
                    @change="onMethodChanged('pointBuy')"
                    id="method-pointbuy"
                  >
                  <label class="form-check-label" for="method-pointbuy">
                    <strong>Point Buy</strong><br>
                    <small class="text-muted">Spend points to customize ability scores</small>
                  </label>
                </div>
              </div>
              
              <div>
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    name="ability-generation-method"
                    :value="'standardArray'"
                    :checked="selectedMethod === 'standardArray'"
                    @change="onMethodChanged('standardArray')"
                    id="method-standard"
                  >
                  <label class="form-check-label" for="method-standard">
                    <strong>Standard Array</strong><br>
                    <small class="text-muted">Assign predetermined values (15, 14, 13, 12, 10, 8)</small>
                  </label>
                </div>
              </div>
              
              <div>
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    name="ability-generation-method"
                    :value="'diceRoll'"
                    :checked="selectedMethod === 'diceRoll'"
                    @change="onMethodChanged('diceRoll')"
                    id="method-dice"
                  >
                  <label class="form-check-label" for="method-dice">
                    <strong>Roll Dice</strong><br>
                    <small class="text-muted">Roll 4d6, drop lowest for each ability</small>
                  </label>
                </div>
              </div>
              
              <div>
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    name="ability-generation-method"
                    :value="'manual'"
                    :checked="selectedMethod === 'manual'"
                    @change="onMethodChanged('manual')"
                    id="method-manual"
                  >
                  <label class="form-check-label" for="method-manual">
                    <strong>Manual Entry</strong><br>
                    <small class="text-muted">Enter custom ability scores</small>
                  </label>
                </div>
              </div>
            </div>
          </pf-card>
        </div>
      </div>
    </div>
  `
});