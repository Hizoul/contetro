#!/usr/bin/env python3

import sys, ctypes
from os.path import abspath
from ctypes import c_char_p, c_uint32, c_uint8, Structure, POINTER,c_void_p,c_int64,c_int16,c_double,c_uint64,c_char_p
import numpy as np
from numpy.ctypeslib import ndpointer

class Tuple(Structure):
    _fields_ = [("placed", c_uint8),("reward", c_double),("done", c_uint8),("winner", c_uint8)]
    def __str__(self):
        return "({},{},{},{})".format(self.placed, self.reward,self.done,self.winner)

class GameFieldS(Structure):
    pass

libpath = "./"
# libpath = "../target/release/"
libname = "rustyblocks"
prefix = {'win32': ''}.get(sys.platform, 'lib')
extension = {'darwin': '.dylib', 'win32': '.dll'}.get(sys.platform, '.so')
absolute_lib_path = abspath(libpath + prefix + libname + extension)
print("Loading rustyblocks from ", absolute_lib_path)
rustLib = ctypes.cdll.LoadLibrary(absolute_lib_path)

rustLib.field_new.restype = POINTER(GameFieldS)
rustLib.field_free.argtypes = (POINTER(GameFieldS), )
rustLib.field_to_string.argtypes = (POINTER(GameFieldS), )
rustLib.field_to_string.restype = c_void_p
rustLib.field_to_json_log.argtypes = (POINTER(GameFieldS), )
rustLib.field_to_json_log.restype = c_void_p
rustLib.field_restore_log.argtypes = (POINTER(GameFieldS), c_char_p)
rustLib.field_to_array.argtypes = (POINTER(GameFieldS), )
rustLib.field_to_array.restype = ndpointer(dtype=ctypes.c_int8, shape=(420,))
rustLib.free_field_array.argtypes = (ndpointer(dtype=ctypes.c_int8, shape=(420,)), )
rustLib.field_do_action.argtypes = (POINTER(GameFieldS), c_uint8)
rustLib.field_do_action.restype = c_uint8
rustLib.field_do_action_with_answer.argtypes = (POINTER(GameFieldS), c_uint8, c_uint8)
rustLib.field_do_action_with_answer.restype = Tuple
rustLib.field_is_game_over.argtypes = (POINTER(GameFieldS), )
rustLib.field_is_game_over.restype = c_uint8
rustLib.field_get_reward.argtypes = (POINTER(GameFieldS), )
rustLib.field_get_reward.restype = c_double
rustLib.field_counter_action.argtypes = (POINTER(GameFieldS), )
rustLib.field_counter_action.restype = c_int64
rustLib.field_counter_action_index.argtypes = (POINTER(GameFieldS), )
rustLib.field_counter_action_index.restype = c_uint8
rustLib.field_reset.argtypes = (POINTER(GameFieldS), )
rustLib.free_string.argtypes = (c_void_p, )
rustLib.eval_heuristic_weights.argtypes = (c_double,c_double,c_double,c_double)
rustLib.eval_heuristic_weights.restype = c_uint64

def field_to_string(field):
  ptr = rustLib.field_to_string(field)
  try:
    return ctypes.cast(ptr, ctypes.c_char_p).value.decode('utf-8')
  finally:
    rustLib.free_string(ptr)
def field_to_log(field):
  ptr = rustLib.field_to_json_log(field)
  try:
    return ctypes.cast(ptr, ctypes.c_char_p).value.decode('utf-8')
  finally:
    rustLib.free_string(ptr)

def field_to_array(field):
  original_array = rustLib.field_to_array(field)
  result = original_array.copy().reshape((42,10))
  rustLib.free_field_array(original_array)
  return result

def field_string_to_array(field_string):
  field_array = np.zeros((20,10), dtype=np.uint8)
  row = 0
  col = 0
  for i in range(len(field_string)):
    entry = field_string[i]
    if entry == '\n':
      col = 0
      row += 1
    elif row < 20 and col < 10:
      field_array[row][col] = ord(entry) - 48
      col += 1
  return field_array