const margin =
  0.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const initializeScrollBehavior = (list, borderStyle) => {
  if (list.children.length > 0) {
    const childOffsets = Array.from(list.children)
      .map(child => child.clientHeight)
      .reduce((a, v, i) => {
        const prevElement = a[i - 1];
        const start = prevElement ? prevElement[1] + margin : 0;
        return [...a, [start, start + v]]
      }, []);
    
    const handleScroll = ({ target }) => {
      const { scrollTop: pos, clientHeight, style } = target;
      const bottomPos = pos + clientHeight;
      let topBorder, bottomBorder;
      
      childOffsets.forEach(([start, end]) => {
        if (pos > start && pos < end) topBorder = true;
        if (bottomPos > start && bottomPos < end) bottomBorder = true;
      });
      
      style.borderTop = topBorder ? borderStyle : 'none';
      style.borderBottom = bottomBorder ? borderStyle : 'none';
    }

    handleScroll({ target: list });
    return handleScroll;
  }
};