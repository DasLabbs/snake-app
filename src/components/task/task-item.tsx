import React from 'react';
import { ASSETS } from '@src/assets';

import Button from '../shared/button';

type TaskItemProps = {
  task: string;
  name: string;
  description?: string;
  img?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const TaskItem = (props: TaskItemProps) => {
  const { task, name, description, img, disabled, onClick } = props;
  return (
    <div className={`flex items-center gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <Button variant="secondary" size="sm" className="!m-0 flex items-center gap-1 text-xs ss:text-sm">
        +1
        <img src={ASSETS.heartShadowIcon} alt="heart" width={12} height={12} className="w-3" />
      </Button>
      <div className="flex flex-col items-start gap-1">
        <div className="text-[10px] text-white ss:text-xs">
          <div>{task}</div>
          <p>{name}</p>
          {description && <p>{description}</p>}
        </div>
        <div className="w-fit">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1 text-[8px] font-light ss:text-xs"
            onClick={onClick && onClick}
            disabled={disabled}
          >
            {img && <img src={img} alt="icon" width={12} height={12} className="w-3" />}
            {task}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
