/**
 * Created by Ellery1 on 16/7/8.
 */
import ReactInjection from 'react/lib/ReactInjection';
import TapEventPlugin from 'react/lib/TapEventPlugin';

ReactInjection.EventPluginHub.injectEventPluginsByName({TapEventPlugin: TapEventPlugin});