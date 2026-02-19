import { act, renderHook } from '@testing-library/react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { bench } from 'vitest';
import { useIsomorphicEffect, useScheduledEffect } from '../../src/hooks';

function useEffectHook(callback: () => void | (() => void), deps: any[] = []) {
  useEffect(callback, deps);
}

function useLayoutEffectHook(
  callback: () => void | (() => void),
  deps: any[] = [],
) {
  useLayoutEffect(callback, deps);
}

function useIsomorphicEffectHook(
  callback: () => void | (() => void),
  deps: any[] = [],
) {
  useIsomorphicEffect(callback, deps);
}

function useScheduledEffectHook(
  callback: () => void | (() => void),
  deps: any[] = [],
) {
  useScheduledEffect(callback, deps);
}

// Scenario 1: Empty effect overhead
bench('useEffect - empty effect', () => {
  renderHook(() => {
    useEffectHook(() => {});
  });
});

bench('useLayoutEffect - empty effect', () => {
  renderHook(() => {
    useLayoutEffectHook(() => {});
  });
});

bench('useIsomorphicEffect - empty effect', () => {
  renderHook(() => {
    useIsomorphicEffectHook(() => {});
  });
});

bench('useScheduledEffect - empty effect', () => {
  renderHook(() => {
    useScheduledEffectHook(() => {});
  });
});

// Scenario 2: Effect with state update
bench('useEffect - state update', () => {
  renderHook(() => {
    const [, setCount] = useState(0);
    useEffectHook(() => {
      setCount(1);
    });
  });
});

bench('useLayoutEffect - state update', () => {
  renderHook(() => {
    const [, setCount] = useState(0);
    useLayoutEffectHook(() => {
      setCount(1);
    });
  });
});

bench('useIsomorphicEffect - state update', () => {
  renderHook(() => {
    const [, setCount] = useState(0);
    useIsomorphicEffectHook(() => {
      setCount(1);
    });
  });
});

bench('useScheduledEffect - state update', () => {
  renderHook(() => {
    const [, setCount] = useState(0);
    useScheduledEffectHook(() => {
      setCount(1);
    });
  });
});

// Scenario 3: Effect with cleanup
bench('useEffect - with cleanup', () => {
  renderHook(() => {
    useEffectHook(() => {
      return () => {};
    });
  });
});

bench('useLayoutEffect - with cleanup', () => {
  renderHook(() => {
    useLayoutEffectHook(() => {
      return () => {};
    });
  });
});

bench('useIsomorphicEffect - with cleanup', () => {
  renderHook(() => {
    useIsomorphicEffectHook(() => {
      return () => {};
    });
  });
});

bench('useScheduledEffect - with cleanup', () => {
  renderHook(() => {
    useScheduledEffectHook(() => {
      return () => {};
    });
  });
});

// Scenario 4: Effect with dependencies
bench('useEffect - with deps', () => {
  renderHook(() => {
    const [count] = useState(0);
    useEffectHook(() => {}, [count]);
  });
});

bench('useLayoutEffect - with deps', () => {
  renderHook(() => {
    const [count] = useState(0);
    useLayoutEffectHook(() => {}, [count]);
  });
});

bench('useIsomorphicEffect - with deps', () => {
  renderHook(() => {
    const [count] = useState(0);
    useIsomorphicEffectHook(() => {}, [count]);
  });
});

bench('useScheduledEffect - with deps', () => {
  renderHook(() => {
    const [count] = useState(0);
    useScheduledEffectHook(() => {}, [count]);
  });
});

// Scenario 5: Multiple effects in one component
bench('useEffect - multiple effects', () => {
  renderHook(() => {
    useEffectHook(() => {});
    useEffectHook(() => {});
    useEffectHook(() => {});
  });
});

bench('useLayoutEffect - multiple effects', () => {
  renderHook(() => {
    useLayoutEffectHook(() => {});
    useLayoutEffectHook(() => {});
    useLayoutEffectHook(() => {});
  });
});

bench('useIsomorphicEffect - multiple effects', () => {
  renderHook(() => {
    useIsomorphicEffectHook(() => {});
    useIsomorphicEffectHook(() => {});
    useIsomorphicEffectHook(() => {});
  });
});

bench('useScheduledEffect - multiple effects', () => {
  renderHook(() => {
    useScheduledEffectHook(() => {});
    useScheduledEffectHook(() => {});
    useScheduledEffectHook(() => {});
  });
});
