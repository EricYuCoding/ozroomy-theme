(() => {
  if (window.inventoryV2SwatchesInitialized) return;
  window.inventoryV2SwatchesInitialized = true;

  if (typeof subscribe !== 'function' || typeof PUB_SUB_EVENTS !== 'object') return;

  const groupForState = (state) => {
    if (state === 'in_stock' || state === 'low_stock') return 'ready_to_ship';
    if (state === 'made_to_order') return 'made_to_order';
    if (state === 'out_of_stock') return 'out_of_stock';
    if (state === 'untracked') return 'untracked';
    return 'missing';
  };

  const labelForState = (container, state) => {
    if (state === 'in_stock' || state === 'low_stock') return container.dataset.labelReadyToShip;
    if (state === 'made_to_order') return container.dataset.labelMadeToOrder;
    if (state === 'out_of_stock') return container.dataset.labelOutOfStock;
    if (state === 'untracked') return container.dataset.labelUntracked;
    return container.dataset.labelMissing;
  };

  const parseJson = (element) => {
    if (!element) return null;
    try {
      return JSON.parse(element.textContent);
    } catch {
      return null;
    }
  };

  const selectedOptions = (picker) =>
    Array.from(picker.querySelectorAll('.product-form__input')).map((option) => {
      const select = option.querySelector('select');
      if (select) return select.value;
      return option.querySelector('input[type="radio"]:checked')?.value;
    });

  const regroupPicker = (picker) => {
    if (!picker || picker.dataset.inventoryGroupingStatus !== 'complete') return;

    const variants = parseJson(picker.querySelector('[data-product-variants]'));
    const states = parseJson(picker.querySelector('[data-inventory-variant-states]'));
    if (!Array.isArray(variants) || !states) return;

    const selected = selectedOptions(picker);

    picker.querySelectorAll('[data-inventory-swatch-groups]').forEach((container) => {
      if (container.dataset.inventoryGroupingStatus !== 'complete') return;

      const optionIndex = Number(container.dataset.optionPosition) - 1;
      const swatches = Array.from(container.querySelectorAll('[data-inventory-swatch-index]')).sort(
        (left, right) => Number(left.dataset.inventorySwatchIndex) - Number(right.dataset.inventorySwatchIndex)
      );

      swatches.forEach((swatch) => {
        const input = swatch.querySelector('input[type="radio"]');
        if (!input) return;

        const candidate = [...selected];
        candidate[optionIndex] = input.value;
        const variant = variants.find(
          (item) => item.options.length === candidate.length && item.options.every((value, index) => value === candidate[index])
        );
        const state = variant ? states[String(variant.id)] || 'missing' : 'missing';
        const groupName = groupForState(state);
        const targetItems = container.querySelector(
          `[data-inventory-swatch-group="${groupName}"] [data-inventory-swatch-group-items]`
        );
        if (!targetItems) return;

        swatch.dataset.inventoryState = state;
        if (variant) {
          swatch.dataset.variantId = variant.id;
        } else {
          delete swatch.dataset.variantId;
        }

        const status = swatch.querySelector('[data-inventory-swatch-status]');
        if (status) status.textContent = labelForState(container, state);
        targetItems.append(swatch);
      });

      container.querySelectorAll('[data-inventory-swatch-group]').forEach((group) => {
        const items = group.querySelector('[data-inventory-swatch-group-items]');
        group.hidden = !items || items.children.length === 0;
      });
    });
  };

  const syncSwatchGroups = ({ data }) => {
    if (!data?.html || !data.sectionId) return;

    const pickerId = `variant-selects-${data.sectionId}`;
    const targetPicker = document.getElementById(pickerId);
    const sourcePicker = data.html.getElementById(pickerId);
    if (!targetPicker || !sourcePicker) return;

    const targetStates = targetPicker.querySelector('[data-inventory-variant-states]');
    const sourceStates = sourcePicker.querySelector('[data-inventory-variant-states]');
    if (targetStates && sourceStates) targetStates.textContent = sourceStates.textContent;

    regroupPicker(targetPicker);
  };

  document.addEventListener('change', (event) => {
    regroupPicker(event.target.closest('variant-selects'));
  });
  subscribe(PUB_SUB_EVENTS.variantChange, syncSwatchGroups);
})();
